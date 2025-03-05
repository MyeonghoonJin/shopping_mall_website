'use client'

import { useState } from "react"

export default function ProductMainInfo({product , styles}){

    let imgs = product.thumbnail
    let [idx,setIdx] = useState(0)  

    // console.log(imgs)
    
    //오른쪽 넘기기
    let nextSlide = () => {
        setIdx((prevIdx) => 
            prevIdx == imgs.length - 1 ? 0 : prevIdx + 1
        )
    }
    //왼쪽 넘기기
    let prevSlide = () => {
        setIdx((prevIdx) => 
            prevIdx == 0 ? imgs.length - 1 : prevIdx - 1
        )
    }
    //구매 버튼
    let handleParchaseBtn = () => {
        
    }
    //장바구니 버튼
    let handleAddToCartBtn = () => {

    }
    return(
        <div className={styles["product-info"]}>
            <div className={styles["product-mainInfo-container"]}>
                <div className={styles["product-mainInfo-thumbnails-carousel"]}>
                {/* 이미지 캐러셀 */}
                    {/* 현재 이미지 */}
                    <img
                        src={imgs[idx] ? imgs[idx] : '/사진 로딩.jpg'}
                        alt="No img"
                        className={styles["carousel-image"]}
                    />

                    {/* 왼쪽 버튼 */}
                    <button className={styles["carousel-button"] + ' ' + styles["left"]} onClick={prevSlide}>
                        ❮
                    </button>

                    {/* 오른쪽 버튼 */}
                    <button 
                    className={styles["carousel-button"] + ' ' + styles["right"]} 
                    onClick={nextSlide}>
                        ❯
                    </button>
                    {/* 페이지네이션 (하단 점) */}
                    <div className={styles["carousel-pagination"]}>
                        {
                            imgs ? 
                            imgs.map((a, i) => (
                                <span
                                key={i}
                                className={`${styles.dot} ${idx === i ? styles.active : ""}`}
                                onClick={() => setIdx(i)}
                                ></span>
                            ))
                            : <span className={styles["dot"]}></span>
                        }
                    </div>
                </div>
                <div className={styles["product-mainInfo-parchase-info-container"]}>
                    <hr></hr>
                    <div className={styles["parchase-info-top"]}>
                        <h2 className={styles["parchase-info-top-product_name"]}>
                            {product.product_name}
                            <br></br><br></br>
                        </h2>
                        <div className={styles["parchase-info-top-heart"]}>
                            <img className={styles["heart-img"]} src='/빈하트.png' />
                        </div>
                    </div>
                    <h2 className={styles["parchase-info-top-price"]}>{product.price}원</h2>
                    <div className={styles["button-container"]}>
                        <button className={styles["addToCart-button"]} onClick={handleAddToCartBtn}>장바구니 담기</button>
                        <button className={styles["parchase-button"]} onClick={handleParchaseBtn}>구매하기</button>
                    </div>
                </div>
            </div>
        </div>
    )
}