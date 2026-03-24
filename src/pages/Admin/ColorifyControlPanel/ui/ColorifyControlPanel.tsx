import React from "react";
import styles from "../ColorifyControlPanel.module.css"

export const ColorifyControlPanel: React.FC = () => {
    return(
        <div className={styles.mainContainer}>
            <div className={styles.infoBox}>
                <p className={styles.infoText}>Стастистика</p>
                <span className={styles.infoSpan}>Общая статистика пользователей</span>
                
            </div>

            <div className={styles.statsContainer}>
                
                <div className={styles.cardInputs}>
                    <p className={styles.statValue}>123</p>
                    <p className={styles.statLabel}>Пользователей</p>
                    
                </div>
                <div className={styles.cardInputs}>
                    <p className={styles.statValue}>456</p>
                    <p className={styles.statLabel}>Записей</p>

                </div>
                <div className={styles.cardInputs}>
                    <p className={styles.statValue}>789</p>
                    <p className={styles.statLabel}>Средняя калорийность</p>
                </div>
                
            </div>
        </div>
    )
} 

export default ColorifyControlPanel;