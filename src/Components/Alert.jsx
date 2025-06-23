import { useEffect, useState } from "react"
import styles from "./Alert.module.css"

function Alert ( {message, type, show}) {
    const [showAlert, setShowAlert] = useState( show )

    useEffect( () => {
        setShowAlert(show)
    }, [show])

    function handleOnClick(e) {
        setShowAlert(false)
    }

    return (
        <>
        { showAlert && 
            <>
            { type === "success" && 
                <div 
                    className = {`${styles.container} ${styles.success}`}
                    onClick = {handleOnClick}
                >
                    <p>{message}</p>
                </div>
            }
            { type === "error" &&
                <div 
                    className = {`${styles.container} ${styles.error}`}
                    onClick = {handleOnClick}
                >
                    <p>{message}</p>
                </div>
            }
            </>
        }
        </>
    )
}

export default Alert