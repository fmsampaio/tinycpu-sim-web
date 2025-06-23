import Alert from "./Alert"
import styles from "./SimulationControl.module.css"

function SimulationControl( {handleStepBtn, handleResetBtn, handleRunBtn, hltReached, invalidInst, noHltDetected, timeout} ) {
    

    return (
        <div className = {styles.container}>
            <h2>Simulation</h2>
            <div className = {styles.btns_container}>
                <button 
                    className={styles.button_4}
                    onClick={handleStepBtn}
                >
                    Step
                </button>
                <button
                    className={styles.button_4}
                    onClick={handleRunBtn}
                >
                    Run
                </button>
                <button
                    className={styles.button_4}
                    onClick={handleResetBtn}
                >
                    Reset
                </button>
            </div>
            <Alert message="Timeout!" type="error" show={timeout}/>     
            <Alert message="HLT reached!" type="success" show={hltReached}/>     
            <Alert message="Invalid instruction!" type="error" show={invalidInst}/>
            <Alert message="No HLT instruction!" type="error" show={noHltDetected}/>
        </div>
    )
}

export default SimulationControl