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
    let [editorHeight, setEditorHeight] = useState(500); // 초기 크기 설정
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
    },[selectedCategory])

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
        filenames.forEach((file) => params.append("file", file));

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
        console.log('imgURLs : ',imgURLs) 
        return imgURLs
    }

    // 🔹 커서 위치에 이미지 삽입 함수
    const insertImageAtCursor = (urls) => {
        const editor = editorRef.current;
        if (!editor) return;
        urls.forEach((url,i) => {
            const img = document.createElement("img");
            img.src = url;
            img.style.maxWidth = "100%";
            img.style.height = "auto";
            img.style.margin = "5px 0";
            img.contentEditable = false;
            editor.appendChild(img);
            editor.appendChild(document.createElement("br"));
        });
        adjustHeight(); // 이미지 추가 후 높이 조정
    };

    // 🔹 Backspace 키로 이미지 삭제 감지
    const handleKeyDown = (event) => {
        if (event.key === "Backspace") {

            const editor = editorRef.current;
            if (!editor) return;
            
            const remainingImages = Array.from(editor.querySelectorAll("img")).map(img => img.src);
            
            // ✅ `images` 상태를 현재 에디터 내 남아 있는 이미지들과 동기화
            setImages((prevImages) => {
                const updatedImages = prevImages.filter(src => remainingImages.includes(src));
                setTimeout(adjustHeight, 0); // ✅ 상태 업데이트 후 즉시 실행
                return updatedImages;
            });
        }
    };
    // 🔹 높이를 즉시 반영하도록 개선
    const adjustHeight = (force = false) => {
        const editor = editorRef.current;
        if (!editor) return;

        requestAnimationFrame(() => {
            const newHeight = editor.scrollHeight;
            setEditorHeight((prevHeight) => {
                if (force || newHeight !== prevHeight) {
                    return newHeight > 1000 ? newHeight : 1000; // 최소 높이 유지
                }
                return prevHeight;
            });
        });
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
                                    <img className='thumbnail-preview' src={tn} />
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
                <div className="detail-info-register">
                    <label>상세정보 입력</label>
                    <span onClick={() => {
                        if (fileInputRef2.current) {
                            fileInputRef2.current.click(); // 숨겨진 input 클릭
                        }
                    }}
                    style={{ cursor: 'pointer'}}> 🔗</span>
                    {/*-------------------------- hidden input -------------------------------*/}
                    <input type="hidden" name="description" ref={hiddenInputRef} />
                    <input type="hidden" name="thumbnail" value={thumbnail.length > 0 ? thumbnail : ""}  />

                    <input
                        type="file"
                        ref={fileInputRef2}
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={async(e) => {
                            let urls = await handleImageUpload(e,false)
                            if(urls){
                                setImages((prev) => [...prev, ...urls]);
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
                        style={{ height: editorHeight + "px", overflow: "hidden" }}
                    />
                </div>
                <button type="submit" onClick={() => {
                    if (hiddenInputRef.current && editorRef.current) {
                        hiddenInputRef.current.value = editorRef.current.innerHTML; // ✅ `div` 내용을 `hidden input`에 저장
                    }
                }}>상품 등록</button>
            </form>
        </div>
    )
}