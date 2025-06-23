import styles from './App.module.css';
import { useEffect, useState } from 'react';
import InstructionMemory from './Components/InstructionMemory';
import DataMemory from './Components/DataMemory'
import RegisterBank from './Components/RegisterBank';
import SimulationControl from './Components/SimulationControl';
import { instructionExecution, instructionFetch, copyAndChangeMemoryPosition, instructionExecutionOnRun, parseAssembly, checkHltInstInMemory } from "./Core/TinyCPUFunctions"
import OptionsPanel from './Components/OptionsPanel';
import { saveAs } from 'file-saver';
import AboutPanel from './Components/AboutPanel';


function App() {

  const [instMem, setInstMem] = useState( [] )
  const [dataMem, setDataMem] = useState( [] )
  const [regs, setRegs] = useState( [] )
  
  const [hltReached, setHltReached] = useState( false )
  const [timeout, setTimeout] = useState( false )
  const [invalidInst, setInvalidInst] = useState( false )
  const [noHltDetected, setNoHltDetected] = useState( false )
  
  const [highlightDataMem, setHighlightDataMem] = useState ( {highlight : false, address : -1} )
  const [highlightInstMem, setHighlightInstMem] = useState ( {highlight : false, address : -1} )
  const [highlightReg, setHighlightReg] = useState ( {highlight:false, reg : ""} )
  
  useEffect( () => {
    resetCpu() 
    resetMemories() 
  }, []
  )


  useEffect( () => {
    handleMemoriesAndRegHighlight(regs.PC)
  }, [instMem])

  useEffect( () => {
    console.log(noHltDetected)
  }, [noHltDetected])


  function resetMemories() {
    setDataMem([
      {address : 0, data : 0}, 
      {address : 1, data : 0}, 
      {address : 2, data : 0}, 
      {address : 3, data : 0}, 
      {address : 4, data : 0}, 
      {address : 5, data : 0}, 
      {address : 6, data : 0}, 
      {address : 7, data : 0}, 
      {address : 8, data : 0}, 
      {address : 9, data : 0}, 
      {address : 10, data : 0}, 
      {address : 11, data : 0}, 
      {address : 12, data : 0}, 
      {address : 13, data : 0}, 
      {address : 14, data : 0}, 
      {address : 15, data : 0}
    ])
    setInstMem([
      {address : 0 ,  assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 1 ,  assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 2 ,  assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 3 ,  assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 4 ,  assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 5 ,  assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 6 ,  assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 7 ,  assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 8 ,  assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 9 ,  assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 10 , assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 11 , assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 12 , assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 13 , assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 14 , assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}},
      {address : 15 , assembly : "", inst : {is_valid : false, fields : {}, bin : "", dec : 0, hex : ""}}    ])
  }

  function resetCpu() {
    setRegs({
      RA : 0,
      RB : 0,
      PC : 0,
      RI : 0,
      RN : 0,
      RZ : 0
    })
    setHltReached(false)
    setTimeout(false)
    setInvalidInst(false)
    handleMemoriesAndRegHighlight(0)
  }

  function updateInstMem(address, instruction) {
    setInstMem(copyAndChangeMemoryPosition(instMem, address, instruction))
  }

  function updateDataMem(address, data) {
    setDataMem(copyAndChangeMemoryPosition(dataMem, address, data))
  }

  function handleStepBtn() {
    if(!hltReached && !invalidInst) {
      const returnInstFetch = instructionFetch( instMem, regs )
      const returnInstExec = instructionExecution( dataMem, returnInstFetch.regs, returnInstFetch.curr_inst, updateDataMem  )

      setRegs(returnInstExec.regs)
      setHltReached(returnInstExec.hlt_reached)
      setInvalidInst(returnInstExec.invalid_inst)

      handleMemoriesAndRegHighlight(returnInstExec.regs.PC)
    }
  }

  function handleRunBtn() {
    var returnInstFetch = {}
    var returnInstExec = {}

    var regsTmp = regs
    var dataMemTmp = dataMem
    var hltReachedTmp = hltReached
    var invalidInstTmp = invalidInst

    var countInstructions = 0

    var noHltDetectedTmp = !checkHltInstInMemory(instMem)
    setNoHltDetected(noHltDetectedTmp)

    if(noHltDetectedTmp) {
      console.log('No HLT!')
      return 
    }

    while(!hltReachedTmp && !invalidInstTmp) {
      if(countInstructions > 1000) {
        setTimeout(true)
        break
      }

      returnInstFetch = instructionFetch( instMem, regsTmp )
      returnInstExec = instructionExecutionOnRun( dataMemTmp, returnInstFetch.regs, returnInstFetch.curr_inst  )

      regsTmp = returnInstExec.regs
      dataMemTmp = returnInstExec.data_memory
      hltReachedTmp = returnInstExec.hlt_reached
      invalidInstTmp = returnInstExec.invalid_inst

      countInstructions += 1
    }

    setDataMem(dataMemTmp)
    setRegs(returnInstExec.regs)
    setHltReached(hltReachedTmp)
    setInvalidInst(invalidInstTmp)
  }

  function handleMemoriesAndRegHighlight(PC) {
    if(instMem.length === 0) 
      return

    var jumpInstructions = ["JMP", "JC"]
    var dataMemInstructions = ["LDR", "STR", "ADD", "SUB"]
    var regInstructions = ["LDR", "STR", "ADD", "SUB"]

    var currInst = instMem[PC]
    
    if(currInst.inst.is_valid) {
      var highlightInstMem = {
        highlight : false,
        address : -1
      } 
      
      if(jumpInstructions.includes(currInst.inst.fields.inst)) {
        highlightInstMem = {
          highlight : true,
          address : parseInt(currInst.inst.fields.mem)
        }
        
      }

      var highlightDataMem = {
        highlight : false,
        address : -1
      }

      if(dataMemInstructions.includes(currInst.inst.fields.inst)) {
        highlightDataMem = {
          highlight : true,
          address : parseInt(currInst.inst.fields.mem)
        }
      }

      var highlightReg = {
        highlight : false,
        reg : ""
      }

      if(regInstructions.includes(currInst.inst.fields.inst)) {
        highlightReg = {
          highlight : true,
          reg : currInst.inst.fields.reg
        }
      }

      setHighlightInstMem(highlightInstMem)
      setHighlightDataMem(highlightDataMem)  
      setHighlightReg(highlightReg)      
    }
  }

  function handleClearMemories() {
    resetMemories()
    resetCpu()
  }

  function handleSaveMemories() {
    var fileContent = ""
    instMem.map( (instruction) => (
      fileContent += `${instruction.address}:${(instruction.inst.is_valid) ? instruction.assembly : ""}\n`
    ))
    dataMem.map( (data) => (
      fileContent += `${data.address}:${data.data}\n`
    ))

    const file = new Blob(
      [fileContent], 
      { type : 'text/plain;charset=utf-8'}
    )
    saveAs(file, 'output.mem')
  }

  function handleLoadMemories(fileContent) {
    var lines = fileContent.split("\n")
    /* Instructions memory */
    var instMem = []
    for (let i = 0; i < 16; i++) {
      const assembly = lines[i].split(":")[1];      
      var newInstData = parseAssembly(assembly)

      var newInst = {
          address : i,
          assembly : assembly,
          inst : newInstData
      }
      instMem.push(newInst)
    }

    var dataMem = []
    for (let i = 16; i < 32; i++) {
      const data = parseInt(lines[i].split(":")[1]);
      var newData = {
        address : i-16,
        data : data
      }
      dataMem.push(newData)
    }
    
    setInstMem(instMem)
    setDataMem(dataMem)
    resetCpu()
  }



  return (
    <div className = {styles.container}>
      <InstructionMemory memoryData = {instMem} updateMem = {updateInstMem} pc = {regs.PC} highlight = {highlightInstMem}/>
      <DataMemory memoryData = {dataMem} updateMem = {updateDataMem} highlight = {highlightDataMem}/>
      <div className={styles.side_container}>
        <RegisterBank regs={regs} highlight = {highlightReg} />
        <div className={styles.controls_container}>
          <SimulationControl handleStepBtn={handleStepBtn} handleResetBtn={resetCpu} hltReached={hltReached} invalidInst={invalidInst} noHltDetected={noHltDetected} handleRunBtn={handleRunBtn} timeout={timeout}/>
          <OptionsPanel handleClearMemories={handleClearMemories} handleSaveMemories={handleSaveMemories} handleLoadMemories={handleLoadMemories}/>
        </div>
        <AboutPanel />
      </div>
    </div>

  );
}

export default App;
