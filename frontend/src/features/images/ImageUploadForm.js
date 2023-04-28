
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Container,
            Row, Col,
            Button, Form, FormGroup } from "react-bootstrap"

const ImageUploadForm = () => {

    const [selectedFiles, setSelectedFiles] = useState([])

    const { register, handleSubmit } = useForm()
    const onSubmit = async (data) => {
      const formData = new FormData()
      formData.append("myFile", data.myFile[0])

      const res = await fetch("http://localhost:3500/images", {
        method: "POST",
        body: formData,
      }).then((res) => res.json())
        alert(JSON.stringify(`${res.message}, status: ${res.status}`))
        setSelectedFiles([])
    }

    const onFileChanged = e => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFiles(selectFiles => [...selectFiles, URL.createObjectURL(e.target.files[0])])
        }
    }

    return (
        <Container>
        <div className="row">
            <div className="col-sm-8 mt-3">
                <h4>Select Image to Upload</h4>

          <Form className="mt-4"
            action="http://localhost:3500/images"
            method="POST"
            encType="multipart/form-data"
            onChange={onFileChanged}
            onSubmit={handleSubmit(onSubmit)}>
            <FormGroup className="form-group">
                <input
                  type="file"
                  name="myFile"
                  id="myFile"
                  title=" "
                  {...register("myFile")} //react-hook-form
                  className="form-control-file border"/>
                <Button type="submit" className="btn btn-primary">Submit</Button>
            </FormGroup>
          </Form>
        </div>
      </div>
      <hr />
      <div className="row">
        <div className="col-sm-12">
          <Row className="preview-images">
            {selectedFiles.map(
                (imageFile, index) => {return <Col  key={index}><img src={imageFile} alt={imageFile}/></Col>}
            )}
          </Row>
        </div>
      </div>
    </Container>
  )
}
export default ImageUploadForm