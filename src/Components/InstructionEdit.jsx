import styles from "./InstructionEdit.module.css"
import { parseAssembly } from "../Core/TinyCPUFunctions"
import { useEffect, useState } from "react"

function InstructionEdit( {instruction, updateMem, pcIsHere, highlight, isHeader} ) {

    const [instState, setInstState] = useState(instruction)
    const [instValue, setInstValue] = useState(!isHeader ? instruction.assembly : '')

    useEffect( () => {
        if(!isHeader) {
            setInstState(instruction)
            setInstValue(instruction.assembly)
        }
    }, [instruction])

    function handleOnChange(e) {
        setInstValue(e.target.value)
    }

    const handleFocus = (event) => event.target.select();
    
    function handleAssemblyInput(e) {
        var newInstData = parseAssembly(e.target.value)

        var newInst = {
            address : instState.address,
            assembly : e.target.value.toUpperCase(),
            inst : newInstData
        }

        setInstValue(e.target.value.toUpperCase())
        setInstState(newInst)
        updateMem(newInst.address, newInst)
    }

    

    return (
        <>        
        {isHeader && 
            <>
                <div className = {styles.container}>
                    <div className = {`${styles.item} ${styles.pc_is_here}`}>
                        <b>PC</b>
                    </div>
                    <div className = {`${styles.item} ${styles.address}`}>
                        <b>Add.</b>
                    </div>
                    <div className = {`${styles.item} ${styles.data_field}`}>
                        <b>Assembly</b>
                    </div>
                    <div className={styles.item}>
                        <b>Hex.</b>
                    </div>
                    <div className={styles.item}>
                        <b>Binary</b>
                    </div>
                </div>
            </>
        }
        {!isHeader && 
            <div className = {pcIsHere ? styles.container_pc_highlight : (highlight ? styles.container_mem_highlight : styles.container)}>
                <div className = {`${styles.item} ${styles.pc_is_here}`}>
                    {pcIsHere ? "PC" : ""}
                </div>
                <div className = {`${styles.item} ${styles.address}`}>
                    {instState.address}
                </div>
                <div>
                    { (instState.inst.is_valid | instState.assembly === "") ? 
                        <input 
                            type= "text"
                            value= {instValue}        
                            className = {`${styles.item} ${styles.data_field}`}
                            onBlur = {handleAssemblyInput}
                            onFocus = {handleFocus}
                            onChange = {handleOnChange}
                        />
                    :
                        <input 
                            type= "text"
                            value= {instValue}
                            className = {`${styles.item} ${styles.data_field} ${styles.not_valid}`}
                            onBlur = {handleAssemblyInput}
                            onFocus = {handleFocus}
                            onChange = {handleOnChange}
                        />
                    }
                </div>
                <div className={styles.item}>
                    {instState.inst.hex}
                </div>
                <div className={styles.item}>
                    {instState.inst.bin}
                </div>
                
            </div>
        }
        </>
        
    )

}


export default InstructionEdit