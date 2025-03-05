'use client'
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function Input({totalbrands,styles}){

    let [selectedCategory, setSelectedCategory] = useState('');
    let [brands, setBrands] = useState([]);
    let [isSelected,setIsSelected] = useState(false);
    let [prevThumbnail,setPrevThumbnail] = useState([])
    let [thumbnail,setThumbnail] = useState([])
    let [prevImages,setPrevImages] = useState([])
    let [images, setImages] = useState([]); 
    let [editorHeight, setEditorHeight] = useState(1000); // 초기 크기 설정
    let router = useRouter();
    let fileInputRef2 = useRef();
    let editorRef = useRef(null);
    let hiddenInputRef = useRef(null);


    // 사용자가 분류를 변경할 때 실행되는 함수
    const handleCategoryChange = (event) => {

        setIsSelected(true)

        const newCategory = event.target.value;
        setSelectedCategory(newCategory); // 선택된 값 업데이트
    }

    useEffect(() => {
        let brandList = totalbrands?.filter(brand => brand.category.includes(selectedCategory));
        setBrands(brandList);

        const image = editorRef.current.querySelectorAll("img");
        image.forEach(img => {
            img.onload = adjustHeight();
        });
    },[selectedCategory],[images])

    //이미지를 s3 저장 및 미리보기를 불러오는 함수
    const handleImageUpload = async(e, isThumbnail) => {
        let files = e.target.files
        if (!files[0]) {
            console.error("파일이 선택되지 않았습니다.");
            return;
        }
        let filenames = []
        let prevThumbnails = []
        let prevImages0 = []
        for(let file of files){
            const objectURL = URL.createObjectURL(file);
            isThumbnail ? prevThumbnails.push(objectURL) : prevImages0.push(objectURL)
            filenames.push(encodeURIComponent(file.name))
        }
        isThumbnail ? setPrevThumbnail(prevThumbnails) : setPrevImages(prevImages0)

        //presignedURL 구해오기
        let params = new URLSearchParams()
        for(let file of files){
            params.append("file",file.name)
        }

        let results = await fetch('../../api/util/presignedURL?' + params.toString())
        results = await results.json()
        
        // console.log('results : ',results)
        
        let imgURLs = []

        for(let i = 0; i < results.length; i++){
            let result = results[i]
            
            //S3 업로드 
            const formData = new FormData()
            Object.entries({ ...result.fields }).forEach(([key, value]) => {
                formData.append(key, value)
            })
            formData.append("file", files[i]); // 파일 추가
            let 업로드결과 = await fetch(result.url, {
                method: 'POST',
                body: formData,
            })
            if(업로드결과.ok){
                imgURLs.push(result.url + '/' + filenames[i])
            }else {
                console.log('실패')
            }
        }
        // console.log('imgURLs : ',imgURLs) 
        return imgURLs
    }

    // 🔹 커서 위치에 이미지 삽입 함수
    const insertImageAtCursor = (urls) => {
        const editor = editorRef.current;
        if (!editor) return;
        urls.forEach((url,i) => {
            const img = document.createElement("img");
            img.src = url;
            img.style.maxWidth = "90%";
            img.style.width = "100%";
            img.style.height = "auto";
            img.style.margin = "5px 0";
            img.style.display = "block";
            img.style.margin = "10px auto";    
            img.contentEditable = false;
            editor.appendChild(img);
            editor.appendChild(document.createElement("br"));
        });
        adjustHeight(); // 이미지 추가 후 높이 조정
    };

    // 🔹 에디터 높이 조정 함수 (이미지 추가 및 삭제 시 동작)
    let adjustHeight = (prevImageCount = null) => {
        let editor = editorRef.current;
        if (!editor) return;

        let images = Array.from(editor.querySelectorAll("img"));
        let textHeight = editor.scrollHeight; // 현재 텍스트 포함 높이
        let extraSpacePerImage = 50; // 각 이미지당 추가 여유 공간 (px)

        let imageLoadPromises = images.map((img) =>
            new Promise((resolve) => {
                if (img.complete) {
                    resolve(img.getBoundingClientRect().height);
                } else {
                    img.onload = () => resolve(img.getBoundingClientRect().height);
                }
            })
        );

        Promise.all(imageLoadPromises).then((heights) => {
            let totalImageHeight = heights.reduce((sum, h) => sum + h, 0);
            let extraHeight = images.length * extraSpacePerImage; // 추가된 이미지 개수만큼 여유 공간 추가

            requestAnimationFrame(() => {
                let newHeight;

                if (prevImageCount !== null && images.length < prevImageCount) {
                    // ✅ 이미지가 삭제된 경우: 최소 높이 유지하면서 줄어든 높이를 반영
                    newHeight = Math.max(1000, Math.min(textHeight, totalImageHeight + extraHeight + 50));
                } else {
                    // ✅ 이미지가 추가된 경우: 추가된 이미지 개수만큼의 여유 공간 포함
                    newHeight = Math.max(1000, Math.max(textHeight, totalImageHeight + extraHeight + 50));
                }

                console.log('newHeight:', newHeight);
                console.log('textHeight:', textHeight);
                console.log('totalImageHeight:', totalImageHeight);
                console.log('extraHeight:', extraHeight);
                console.log('prevImageCount:', prevImageCount);
                console.log('currentImageCount:', images.length);

                setEditorHeight(newHeight);
            });
        });
    };

    // 🔹 이미지 삭제 감지 및 높이 조정
    const handleKeyDown = (event) => {
        if (event.key === "Backspace") {
            let editor = editorRef.current;
            if (!editor) return;

            let prevImageCount = editor.querySelectorAll("img").length; // 이전 이미지 개수
            setTimeout(() => {
                let currentImageCount = editor.querySelectorAll("img").length; // 현재 이미지 개수
                if (currentImageCount < prevImageCount) {
                    adjustHeight(prevImageCount); // ✅ 이미지가 삭제된 경우 높이 조정
                }
            }, 0);
        }
    };


    


    return(
        <div><br></br>
            <h2>상품 정보 입력</h2>
            <form action='../../api/product/register' method="POST"  encType="multipart/form-data">
            <br></br>
                <label>상품명</label>
                <input type="text" name="product_name" className="admin-register-input"/><br></br><br></br>
                <label>분류</label>
                <select name="category" onChange={handleCategoryChange} defaultValue="" >
                    <option value="" disabled>카테고리 선택</option>
                    <option value="여성의류">여성의류</option>
                    <option value="신발">신발</option>
                    <option value="남성의류">남성의류</option>
                    <option value="악세사리">악세사리</option>
                    <option value="기타">기타</option>
                </select><br></br><br></br>
                {
                    isSelected ? 
                    <div>
                        <label>브랜드</label>
                        <select name="brand">
                        {
                            brands?.length > 0 ? 
                                brands.map((brand,i) => {
                                    return(
                                    <option key={i} value={brand.brand_name}>{brand.brand_name}</option>
                                    )
                                })
                            : <option value="">해당없음</option>
                        }
                        </select>
                    </div>
                    : '' 
                }
                <br></br>
                <label>가격</label>
                <input type="text" name='price' onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} />원<br></br><br></br>
                <label>썸네일 이미지</label><br></br>
                <input type="file" className="admin-register-input-thumbnail" accept="image/*" onChange={async(e) => {
                    let urls = await handleImageUpload(e,true)
                    if(urls){
                        setThumbnail(urls)
                    }
                }}multiple />
                <div className="thumbnail-preview-container" >
                {
                    prevThumbnail.length > 0 ? 
                        prevThumbnail.map((tn,idx) => {
                            return(
                                <div key={idx}>
                                    <img className={styles["thumbnail-preview"]} src={tn} />
                                    <button type='button' className="thumbnail-preview-deleteBtn" onClick={() => {
                                        setPrevThumbnail(thumbnail.filter((_, i) => i !== idx));
                                        setThumbnail(thumbnail.filter((_, i) => i !== idx));
                                    }}>X</button>
                                </div>
                                )
                            }) 
                        : ''
                    }
                </div>
                <br></br><br></br>
                <hr></hr><br></br>
                {/* -------------------------------------상세 정보 입력 --------------------------------------------------------*/}
                <div className="detail-info-register">
                    <label>상세정보 입력</label>
                    <span onClick={() => {
                        if (fileInputRef2.current) {
                            fileInputRef2.current.click(); // 숨겨진 input 클릭
                        }
                    }}
                    style={{ cursor: 'pointer'}}> 🔗</span>
                    {/*------------------------------------- hidden input ----------------------------------------------*/}
                    <input type="hidden" name="description" ref={hiddenInputRef} />
                    {
                        thumbnail.map((a,i) => 
                            <input key={i} type="hidden" name="thumbnail" value={a} />
                        )
                    }

                    <input
                        type="file"
                        ref={fileInputRef2}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={async(e) => {
                            let urls = await handleImageUpload(e,false)
                            if(urls){
                                setImages(urls);
                                console.log()
                                insertImageAtCursor(urls)
                                adjustHeight(); // 높이 조정
                            }
                        }}
                    multiple/>
                    <div
                        ref={editorRef}
                        className={styles["admin-register-input-textarea"]}
                        contentEditable="true"
                        placeholder="상품 정보를 입력하세요..."
                        suppressContentEditableWarning={true}
                        onKeyDown={handleKeyDown}
                        style={{
                            height: `${editorHeight}px`,
                            overflow: "hidden",
                            textAlign: "center", // ✅ 텍스트 중앙 정렬
                        }}
                    />
                </div>
                <button type="submit" onClick={() => {
                    if (hiddenInputRef.current && editorRef.current) {
                        hiddenInputRef.current.value = editorRef.current.innerHTML; // ✅ `admin-register-input-textarea` 내용을 `hidden input`에 저장
                    }
                }}>상품 등록</button>
            </form>
        </div>
    )
}