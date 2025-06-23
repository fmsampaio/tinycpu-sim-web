import styles from "./DataEdit.module.css"
import {useState, useEffect} from "react"
import {validateInputData} from "../Core/TinyCPUFunctions"

function DataEdit( {data, updateMem, highlight, isHeader} ) {
    const [dataState, setDataState] = useState(data)
    const [dataValue, setDataValue] = useState(!isHeader ? data.data.toString(): {})

    useEffect( () => {
        if(!isHeader) {
            setDataValue(data.data.toString())
        }
    }, [data])

    const handleFocus = (event) => event.target.select();

    function handleDataInput(e) {
        var validatedData = validateInputData(e.target.value)

        var newDataState = {
            "address" : dataState.address,
            "data" : validatedData.data
        }
       
        e.target.value = validatedData.data
        
        setDataState(newDataState)
        updateMem(newDataState.address, newDataState)
    }

    function handleOnChange(e) {
        setDataValue(e.target.value)
    }
    

    return (
        <>
        {isHeader && 
            <div className = {styles.container}>
                <div className = {`${styles.item} ${styles.address}`}>
                    <b>Add.</b>
                </div>
                <div className = {styles.item}>
                    <b>Data</b>
                </div>
            </div>

        }
        {!isHeader && 
            <div className = {highlight ? styles.container_highlight : styles.container}>
                <div className = {`${styles.item} ${styles.address}`}>
                    {dataState.address}
                </div>
                <div>
                    <input
                        type = "text"
                        value = {dataValue}
                        className = {styles.item}
                        onBlur = {handleDataInput}
                        onFocus = {handleFocus}
                        onChange = {handleOnChange}
                    />
                </div>
            </div>
            }
        </>
    )
}

export default DataEdit