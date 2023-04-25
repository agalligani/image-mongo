
import { useState } from "react"
import { Container,
            Row, Col,
            Button, Form, FormGroup } from "react-bootstrap"
const ImageUploadForm = () => {

    const [selectedFiles, setSelectedFiles] = useState([])

      
    const onFileChanged = e => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFiles(selectFiles => [...selectFiles, URL.createObjectURL(e.target.files[0])])
        }
    }

    return (
        <Container>
        <div className="row">
            <div className="col-sm-8 mt-3">
                <h4>Select Images to Upload</h4>

                <Form className="mt-4"
            action="http://localhost:3500/images"
            method="POST"
            encType="multipart/form-data"
            onChange={onFileChanged}
          >
                    <FormGroup className="form-group">
                        <input
                type="file"
                name="myFile"
                id="myFile"
                className="form-control-file border"
              />
                    </FormGroup>
                    <Button type="submit" className="btn btn-primary">Submit</Button>
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