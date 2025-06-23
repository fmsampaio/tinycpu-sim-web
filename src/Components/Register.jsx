import styles from "./Register.module.css"


function Register ( {name, data, type, highlight} ) {

    function parseDataToHex(data) {
        var hexData = parseInt(data).toString(16).toUpperCase()
        if(hexData.length === 1) {
            hexData = "0" + hexData
        }
        return hexData
    }

    return (
        <div className = {highlight ? styles.container_highlight : styles.container}>
            <h3>{name}</h3>
            { type === "8-bit-hex" && 
                <p className={styles.register_p}>{parseDataToHex(data)}</p>
            }
            { type === "8-bit-dec" && 
                <p className={styles.register_p}>{data}</p>
            }
            { type === "4-bit-dec" &&
                <p className={styles.register_p}>{data}</p>
            }
            { (type === "1-bit" && data === 0)  &&
                <div className = {`${styles.led} ${styles.red}`}> </div>
                
            }
            { (type === "1-bit" && data === 1)  &&
                <div className = {`${styles.led} ${styles.green}`}> </div>
            }
        </div>
    )

}

export default Register