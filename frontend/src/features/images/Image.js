import { useNavigate } from 'react-router-dom'
import { useDeleteImageMutation } from "./imagesApiSlice"

// import { useSelector } from 'react-redux'
// import { selectImageById } from './imagesApiSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

const Image = ({ image }) => {

    const [deleteImage, {
        isSuccess: isDelSuccess,
        isError: isDelError,
        error: delerror
    }] = useDeleteImageMutation()

    const navigate = useNavigate()

    const onDeleteImageClicked = async () => {
        await deleteImage({ id: image.id })
        navigate("/")
    }
    

    // const image = useSelector(state => selectImageById(state, imageId))

    // const navigate = useNavigate()

    if (image) {
        const created = new Date(image.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })
        const updated = new Date(image.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })
        const id = image._id

        return (
            <tr className="table__row">
                <td className="table__cell image__created">

                <button
                            className="icon-button"
                            title="Delete"
                            onClick={onDeleteImageClicked}
                        >
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>                </td>
                <td className="table__cell image__created">{created}</td>
                {/* <td className="table__cell image__updated">{updated}</td> */}
                <td className="table__cell image__title">{image.name}</td>
                <td className="table__cell image__username">
                    <img src={`http://localhost:3500/${image.url}`} alt='unknown'/>
                </td>
            </tr>
        )

    } else return null
}
export default Image