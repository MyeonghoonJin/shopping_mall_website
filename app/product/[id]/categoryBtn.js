'use client'
export default function CategoryBtn({product,styles}){


    // console.log(product)
    return(
        <div className={styles["category-container"]}>
            <span className={styles["category"]} onMouseOver={() => {
                
            }} >
                {product.category1 ? product.category1 : '여성의류'}  
            </span>
             / 
            <span className={styles["category"]} onMouseOver={() => {
                
            }}>
                {product.category2 ? product.category2 : '아우터'}
            </span>
             / 
            <span className={styles["category"]} onMouseOver={() => {
                
            }}>
                {product.category3 ? product.category3 : '재킷'}
            </span>
        </div>
    )
}