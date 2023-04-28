import { store } from '../../app/store'
import { imagesApiSlice } from '../images/imagesApiSlice'
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

const Prefetch = () => {

    useEffect(() => {
        store.dispatch(imagesApiSlice.util.prefetch('getImages', 'imagesList', { force: true }))
    }, [])

    return <Outlet />
}
export default Prefetch