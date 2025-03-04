'use client'

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Items({items,styles}){

    // let default_img = '/grey.png'
    let [fetchedItems,setFetchedItems] = useState([])
    let router = useRouter()

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
        <div className="main-item-container">
            {
                
                items.map((item,idx)=> {
                    return(
                        <div className="main-item" key={idx} >
                            
                            <img className={styles["main-item-thumbnail"]} src={item?.thumbnail ? item.thumbnail : '/사진 로딩.jpg'} alt='No Image' onClick={() => {
                                //디테일 페이지로 이동
                                router.push('/product/' + item._id)
                            }}/>
                            <p className={styles["main-item-brand"]} onClick={() => {
                                // 브랜드 페이지로 이동
                                // router.push('/brand/' + item._brand)
                            }}>{item?.brand ? item.brand : ''}</p>
                            <h4 className={styles["main-item-product_name"]} onClick={() => {
                                //디테일 페이지로 이동
                                router.push('/product/' + item._id)
                            }}>{item?.product_name ? item?.product_name : 'clothes'}</h4>
                            <p className="main-item-product_description">{item?.thumbnail_description ? item.thumbnail_description : 'loading..'} 가격 : {item.price}원</p>
                        </div> 
                    )
                })
            }
        </div>
    )
}