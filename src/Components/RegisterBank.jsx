import styles from "./RegisterBank.module.css"
import Register from './Register';

function RegisterBank( {regs, highlight} ) {
    return (
        <div className = {styles.regs_container}>
        <h2>Registers</h2>
        <div className = {styles.internal_regs_container}>
          <Register name="PC" data={regs.PC} type="4-bit-dec" highlight={false}/>
          <Register name="RI" data={regs.RI} type="8-bit-hex" highlight={false}/>
          <Register name="RA" data={regs.RA} type="8-bit-dec" highlight={highlight.highlight && highlight.reg === "RA"}/>
          <Register name="RB" data={regs.RB} type="8-bit-dec" highlight={highlight.highlight && highlight.reg === "RB"}/>
          <Register name="RZ" data={regs.RZ} type="1-bit" highlight={false}/>
          <Register name="RN" data={regs.RN} type="1-bit" highlight={false}/>
        </div>
           
      </div>

    )
}

export default RegisterBank