const parseAssembly = function (assembly) {
    const parsing = parseAssemblyFields(assembly)
    const fieldsParsed = parsing.fields

    if(!parsing.is_valid)
        return {
            "is_valid" : false,
            "fields" : {},
            "bin" : "",
            "dec" : 0,
            "hex" : ""
        }

    var binCodeStr = getOpCode(fieldsParsed.inst)

    if(isRegInstruction(fieldsParsed.inst)) {
        binCodeStr = binCodeStr.concat(getRegCode(fieldsParsed.reg))
    }
    else if(isJcInstruction(fieldsParsed.inst)) {
        binCodeStr = binCodeStr.concat(getCcCode(fieldsParsed.cc))
    }
    else {
        binCodeStr = binCodeStr.concat("0")
    }
    
    if(!isHltInstruction(fieldsParsed.inst)) {
        binCodeStr = binCodeStr.concat(getMemCode(fieldsParsed.mem))
    }
    else {
        binCodeStr = binCodeStr.concat("0000")
    }

    const decInt = parseInt(binCodeStr, 2)

    return {
        "is_valid" : true,
        "fields" : fieldsParsed,
        "bin" : binCodeStr,
        "dec" : decInt,
        "hex" : decInt.toString(16).toUpperCase()
    }
}


const instructionFetch = function (instMem, regs) {
    const currInstruction = instMem[regs.PC]

    const newRegsState = {
      ...regs, 
      "RI" : currInstruction.inst.dec, 
      "PC" : regs.PC + 1
    }

    return {
        regs : newRegsState,
        curr_inst : currInstruction
    }
}

const instructionExecutionOnRun = function(dataMem, regs, currInstruction) {
    const inst = currInstruction.inst

    var newRegsState = regs
    var wasHltReached = false
    var wasInvalidInst = !inst.is_valid

    if(inst.fields.inst === "LDR") {
        let memAddress = parseInt(inst.fields.mem)
        if(inst.fields.reg === "RA") {
            newRegsState = {
                ...regs,
                "RA" : dataMem[memAddress].data
            }
        }
        else {
            newRegsState = {
                ...regs,
                "RB" : dataMem[memAddress].data
            }
        }
    }
    else if(inst.fields.inst === "STR") {
        let memAddress = parseInt(inst.fields.mem)
        var newData = {
            "address" : memAddress,
            "data" : (inst.fields.reg === "RA") ? regs.RA : regs.RB
        }

        dataMem = copyAndChangeMemoryPosition(dataMem, memAddress, newData)
    }
    else if(inst.fields.inst === "ADD" || inst.fields.inst === "SUB") {
        let memAddress = parseInt(inst.fields.mem)
        var ulaResult
        if(inst.fields.reg === "RA") {
            ulaResult = (inst.fields.inst === "ADD") ? 
                regs.RA + dataMem[memAddress].data : 
                regs.RA - dataMem[memAddress].data 
            
            newRegsState = {
                ...regs,
                "RA" : ulaResult,
                "RZ" : (ulaResult === 0 ? 1 : 0),
                "RN" : (ulaResult < 0 ? 1 : 0)
            }
        }
        else {
            ulaResult = (inst.fields.inst === "ADD") ? 
                regs.RB + dataMem[memAddress].data : 
                regs.RB - dataMem[memAddress].data 

            newRegsState = {
                ...regs,
                "RB" : ulaResult,
                "RZ" : (ulaResult === 0 ? 1 : 0),
                "RN" : (ulaResult < 0 ? 1 : 0)
            }
        }
    }
    else if(isJmpInstruction(inst.fields.inst)) {
        let memAddress = parseInt(inst.fields.mem)
        newRegsState = {
            ...regs,
            "PC" : memAddress
        }
    }
    else if(isJcInstruction(inst.fields.inst)) {
        let memAddress = parseInt(inst.fields.mem)
        if( (inst.fields.cc === "Z" && regs.RZ === 1) ||
            (inst.fields.cc === "N" && regs.RN === 1) ) {
            newRegsState = {
                ...regs,
                "PC" : memAddress
            }
        }
    }
    else if(isHltInstruction(inst.fields.inst)) {
        wasHltReached = true
    }

    return {
        regs : newRegsState,
        hlt_reached : wasHltReached,
        data_memory : dataMem,
        invalid_inst : wasInvalidInst
    }
}

const instructionExecution = function(dataMem, regs, currInstruction, updateDataMem) {
    const inst = currInstruction.inst

    var newRegsState = regs
    var wasHltReached = false
    var wasInvalidInst = ! inst.is_valid

    if(inst.fields.inst === "LDR") {
        let memAddress = parseInt(inst.fields.mem)
        if(inst.fields.reg === "RA") {
            newRegsState = {
                ...regs,
                "RA" : dataMem[memAddress].data
            }
        }
        else {
            newRegsState = {
                ...regs,
                "RB" : dataMem[memAddress].data
            }
        }
    }
    else if(inst.fields.inst === "STR") {
        let memAddress = parseInt(inst.fields.mem)
        var newData = {
            "address" : memAddress,
            "data" : (inst.fields.reg === "RA") ? regs.RA : regs.RB
        }
        updateDataMem(memAddress, newData)
    }
    else if(inst.fields.inst === "ADD" || inst.fields.inst === "SUB") {
        let memAddress = parseInt(inst.fields.mem)
        var ulaResult
        if(inst.fields.reg === "RA") {
            ulaResult = (inst.fields.inst === "ADD") ? 
                regs.RA + dataMem[memAddress].data : 
                regs.RA - dataMem[memAddress].data 
            
            ulaResult = (ulaResult > 127) ? ulaResult - 255 : ulaResult
            ulaResult = (ulaResult < -128) ? ulaResult + 256 : ulaResult
                        
            newRegsState = {
                ...regs,
                "RA" : ulaResult,
                "RZ" : (ulaResult === 0 ? 1 : 0),
                "RN" : (ulaResult < 0 ? 1 : 0)
            }
        }
        else {
            ulaResult = (inst.fields.inst === "ADD") ? 
                regs.RB + dataMem[memAddress].data : 
                regs.RB - dataMem[memAddress].data 
            
            ulaResult = (ulaResult > 127) ? ulaResult - 255 : ulaResult
            ulaResult = (ulaResult < -128) ? ulaResult + 256 : ulaResult

            newRegsState = {
                ...regs,
                "RB" : ulaResult,
                "RZ" : (ulaResult === 0 ? 1 : 0),
                "RN" : (ulaResult < 0 ? 1 : 0)
            }
        }
    }
    else if(isJmpInstruction(inst.fields.inst)) {
        let memAddress = parseInt(inst.fields.mem)
        newRegsState = {
            ...regs,
            "PC" : memAddress
        }
    }
    else if(isJcInstruction(inst.fields.inst)) {
        let memAddress = parseInt(inst.fields.mem)
        if( (inst.fields.cc === "Z" && regs.RZ === 1) ||
            (inst.fields.cc === "N" && regs.RN === 1) ) {
            newRegsState = {
                ...regs,
                "PC" : memAddress
            }
        }
    }
    else if(isHltInstruction(inst.fields.inst)) {
        wasHltReached = true
    }

    return {
        regs : newRegsState,
        hlt_reached : wasHltReached,
        invalid_inst : wasInvalidInst
    }
}

function copyAndChangeMemoryPosition(memory, position, newContent) {
    return memory.map((oldContent, i) => {
        if (i === position) return newContent;
        return oldContent;
      })
}

const validateInputData = function(data) {
    if(isNaN(parseInt(data))) {
        return {
            status : false,
            data : 0
        }
    }
    else {
        var dataInt = parseInt(data)
        dataInt = (dataInt < -128) ? -128 : dataInt
        dataInt = (dataInt > 127) ? 127 : dataInt
        return {
            status : true,
            data : dataInt
        }
    }

}

const checkHltInstInMemory = function(instMem) {
    var hasHltInst = false
    instMem.forEach(data => {
        if(data.inst.is_valid) {
            if(data.inst.fields.inst === 'HLT') {
                hasHltInst = true
                return
            }
        }
    });
    return hasHltInst    
}

export {parseAssembly, instructionFetch, instructionExecution, copyAndChangeMemoryPosition, instructionExecutionOnRun, validateInputData, checkHltInstInMemory}

function parseAssemblyFields(assembly) {
    const assemblyStr = String(assembly).trim().toUpperCase()
    
    var isValid = true
    var fields = {}

    if(validateRegInstruction(assembly) || 
        validateJmpInstruction(assembly) || 
        validateJcInstruction(assembly) ||
        validateHltInstruction(assembly) 
    ) {

        var tokens = assemblyStr.split(' ')
        
        var inst = tokens[0]
        
        if(isRegInstruction(inst)) {
            fields = {
                "inst" : inst,
                "reg" : tokens[1],
                "mem" : tokens[2]
            }
        }
        else if(isJcInstruction(inst)) {
            fields = {
                "inst" : inst,
                "cc" : tokens[1],
                "mem" : tokens[2]
            }
        }
        else if(isJmpInstruction(inst)) {
            fields = {
                "inst" : inst,
                "mem" : tokens[1]
            }
        }
        else {
            fields = {
                "inst" : inst
            }
        }

    }
    else {
        isValid = false
    }

    if((isRegInstruction(inst) || isJmpInstruction(inst) || isJcInstruction(inst))) {
        var memAddress = fields.mem
        if(memAddress < 0 || memAddress > 15) {
            fields = {}
            isValid = false
        }
    }

    return {
        "is_valid" : isValid,
        "fields" : fields
    }
}

function validateRegInstruction(assembly) {
    const regInstructionMatch = /^(\s*)(LDR|STR|ADD|SUB|ldr|str|add|sub)(\s+)(RA|RB|ra|rb)(\s+)(\d+)(\s*)$/
    return regInstructionMatch.test(assembly)
}

function validateJcInstruction(assembly) {
    const jcInstructionMatch = /^(\s*)(JC|jc)(\s+)(N|Z|n|z)(\s+)(\d+)(\s*)$/
    return jcInstructionMatch.test(assembly)
}

function validateJmpInstruction(assembly) {
    const jmpInstructionMatch = /^(\s*)(JMP|jmp)(\s+)(\d+)(\s*)$/
    return jmpInstructionMatch.test(assembly)
}

function validateHltInstruction(assembly) {
    const hltInstructionMatch = /^(\s*)(HLT|hlt)(\s*)$/
    return hltInstructionMatch.test(assembly)
}

function isRegInstruction(inst) {
    var regInstructions = ["LDR", "STR", "ADD", "SUB"]
    return regInstructions.includes(inst)
}

function isJcInstruction(inst) {
    return inst === "JC"
}

function isJmpInstruction(inst) {
    return inst === "JMP"
}

function isHltInstruction(inst) {
    return inst === "HLT"
}

function getOpCode(inst) {
    if(inst === "LDR")
        return "001"
    else if(inst === "STR")
        return "010"
    else if(inst === "ADD")
        return "011"
    else if(inst === "SUB")
        return "100"
    else if(inst === "JMP")
        return "101"
    else if(inst === "JC")
        return "110"
    else if(inst === "HLT")
        return "111"
    else
        return ""    
}

function getRegCode(reg) {
    return (reg === "RA") ? "0" : (reg === "RB") ? "1" : "err"
}

function getCcCode(cc) {
    return (cc === "Z") ? "0" : (cc === "N") ? "1" : "err"
}

function getMemCode(mem) {
    let memInt = parseInt(mem)
    return dec2bin(memInt)
}

function dec2bin(dec) {
    var binStr = (dec >>> 0).toString(2)
    while(binStr.length < 4) {
        binStr = "0".concat(binStr)
    }
    return binStr.substring(binStr.length - 4)
}

