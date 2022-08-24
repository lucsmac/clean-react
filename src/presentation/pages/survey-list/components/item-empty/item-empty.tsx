import React from 'react'
import Styles from './item-empty-styles.scss'

const ItemEmpty: React.FC = () => {
  return (
    <>
      <li className={Styles.itemEmpty}></li>
      <li className={Styles.itemEmpty}></li>
      <li className={Styles.itemEmpty}></li>
      <li className={Styles.itemEmpty}></li>
    </>
  )
}

export default ItemEmpty
