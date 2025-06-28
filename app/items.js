'use client'

import { useRouter,useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Items({items,totalPages,styles}){

    // let default_img = '/grey.png'
    let [fetchedItems,setFetchedItems] = useState([])
    let router = useRouter()
    let searchParams = useSearchParams()
    let currentPage = parseInt(searchParams.get('page')) || 1

    
    useEffect(()=>{
        // fetch('api/product/list?page=main')
        // .then(r =>  r.json())
        // .then((data) => {
        //     setFetchedItems(data)
        // })

        
    },[])
    // router.push('/product/' + item._id)

    // console.log(items.length)
    return(
        <div className={styles["main-item-center-column"]}>
            <h3 className={styles["main-item-category-name"]}>여름 신상</h3>
            <div className={styles["main-item-container"]}>
                
                {
                    
                    items.map((item,idx)=> {
                        return(
                            <div className={styles["main-item"]} key={idx} >
                                
                                <img className={styles["main-item-thumbnail"]} src={item?.thumbnail ? item.thumbnail[0] : '/사진 로딩.jpg'} alt='No Image' onClick={() => {
                                    //디테일 페이지로 이동
                                    router.push('/product/' + item._id)
                                }}/>
                                <div className={styles["main-item-descriptions"]} onClick={() => {
                                        //디테일 페이지로 이동
                                        router.push('/product/' + item._id)
                                    }} >
                                    <p className={styles["main-item-brand"]} onClick={(e) => {
                                        // 브랜드 페이지로 이동
                                        e.stopPropagation();
                                        router.push('/brand/' + item._brand)
                                    }}>{item?.brand ? item.brand : 'No brand'}</p>
                                    <h4 className={styles["main-item-product_name"]} onClick={() => {
                                        //디테일 페이지로 이동
                                        router.push('/product/' + item._id)
                                    }}>{item?.product_name ? item?.product_name : 'Name'}</h4>
                                    <p className="main-item-product_price">가격 : {item.price ?  item.price: '...'}원</p>
                                </div>
                            </div> 
                        )
                    })
                }
            </div>
            {/* 페이지네이션 UI */}
            <div style={{ marginTop: "20px", textAlign: "center" }}>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => router.push(`/?page=` +(i + 1))}
                        style={{ 
                            margin: "0 5px",
                            fontWeight: currentPage === i + 1 ? "bold" : "normal"
                        }}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    )
}