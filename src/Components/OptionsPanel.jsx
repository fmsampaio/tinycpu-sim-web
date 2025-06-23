import styles from "./OptionsPanel.module.css"
import MemFilePicker from "./MemFilePicker";

function OptionsPanel( {handleClearMemories, handleSaveMemories, handleLoadMemories} ) {

    return (
        <div className = {styles.container}>
            <h2>Options</h2>
            <div className = {styles.btns_container} >
                <button className={styles.button_4} onClick={handleClearMemories}>
                    Clear Memories
                </button>
                <button className={styles.button_4} onClick={handleSaveMemories}>
                    Save Memories
                </button>
                <MemFilePicker className={styles.button_4} handleLoadMemories={handleLoadMemories}/>
                
            </div>
        </div>
    )
}

export default OptionsPanel
