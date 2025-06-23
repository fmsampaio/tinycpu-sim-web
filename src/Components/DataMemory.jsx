import styles from "./DataMemory.module.css"
import DataEdit from "./DataEdit"

function DataMemory( {memoryData, updateMem, highlight} ) {

    return (
        <div className = {styles.container}>
            <h2>Data<br/>Memory</h2>
            <div>
                <DataEdit data = {{data:''}} isHeader={true}/>
                { 
                memoryData.map( (data) => (
                    <DataEdit data={data} updateMem={updateMem} highlight={highlight.highlight && (highlight.address === data.address)} isHeader={false}/>
                ))
                }
            </div>
        </div>
    )
}

export default DataMemory