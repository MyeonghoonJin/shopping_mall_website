export default function ProductDetailInfo({product , styles}){
    return(
        <div>
            <hr></hr><br></br>
            <h2 style={{textAlign : "center"}}>상품 설명</h2><br></br>
            <div className={styles["detail-info"]}>
                <div className={styles["detail-info-description"]} dangerouslySetInnerHTML={{__html : product.description}}/>
            </div>
        </div>
    )
}