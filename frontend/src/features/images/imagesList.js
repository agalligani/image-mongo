import { useGetImagesQuery } from "./imagesApiSlice"
import Image from "./Image"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons"

// import useAuth from "../../hooks/useAuth"

const ImagesList = () => {

    // const { username, isManager, isAdmin } = useAuth()

    const {
        data: images,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetImagesQuery('imagesList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }
    

    if (isSuccess) {
        const { ids, entities } = images
        const filteredIds = [...ids]
        const tableContent = ids?.length && filteredIds.map(
            imageId => {
                return <Image key={imageId} image={entities[imageId]} />
                }
            )

        content = (
            <table className="table table--images">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th image__status">Actions</th>
                        <th scope="col" className="table__th image__status">Date</th>
                        <th scope="col" className="table__th image__updated">Filename</th>
                        <th scope="col" className="table__th image__title">Image</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}
export default ImagesList