import styles from "./AboutPanel.module.css"

function AboutPanel() {

    return (
        <div className={styles.container}>
            <h4>TinyCPU Simulator</h4>
            <p>A free web-based simulation environment to execute Assembly instructions of teaching-purpose TinyCPU machine.</p>
            <p style={{textAlign:"right"}}>Available at <a target="_blank" rel="noreferrer" href="https://github.com/fmsampaio/tinycpu-sim-web">Github</a></p>
        </div>
    )
}

export default AboutPanel
