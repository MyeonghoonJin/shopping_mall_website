import aws from 'aws-sdk'
export default async function PresignedURL(req,res){

    if(req.method != 'GET'){
        return res.status(405).json({ error: "잘못된 메소드 요청" });
    }

    console.log(req.query.file)

    aws.config.update({
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        region: 'ap-northeast-2',
        signatureVersion: 'v4',
      })
  
      const s3 = new aws.S3();
      //presignedURL 
      const url = await s3.createPresignedPost({
        Bucket: process.env.BUCKET_NAME,
        Fields: { key : req.query.file },
        Expires: 60, // seconds
        Conditions: [
          ['content-length-range', 0, 1048576], //파일용량 1MB 까지 제한
        ],
      })
  
      res.status(200).json(url)
  

}