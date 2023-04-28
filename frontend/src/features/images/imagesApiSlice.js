import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const imagesAdapter = createEntityAdapter({})

const initialState = imagesAdapter.getInitialState()

export const imagesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getImages: builder.query({
            query: () => '/images',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedImages = responseData.map(image => {
                    image.id = image._id
                    return image
                })
                return imagesAdapter.setAll(initialState, loadedImages)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Image', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Image', id }))
                    ]
                } else return [{ type: 'Image', id: 'LIST' }]
            }
        }),
        // addNewImage: builder.mutation({
        //     query: initialImage => ({
        //         url: '/images',
        //         method: 'POST',
        //         body: {
        //             ...initialImage,
        //         }
        //     }),
        //     invalidatesTags: [
        //         { type: 'Image', id: "LIST" }
        //     ]
        // }),
        // updateImage: builder.mutation({
        //     query: initialImage => ({
        //         url: '/images',
        //         method: 'PATCH',
        //         body: {
        //             ...initialImage,
        //         }
        //     }),
        //     invalidatesTags: (result, error, arg) => [
        //         { type: 'Image', id: arg.id }
        //     ]
        // }),
        deleteImage: builder.mutation({
            query: ({ id }) => ({
                url: `/images`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Image', id: arg.id }
            ]
        }),
    }),
})

export const {
    useGetImagesQuery,
    // useAddNewImageMutation,
    // useUpdateImageMutation,
    useDeleteImageMutation,
} = imagesApiSlice

// returns the query result object
export const selectImagesResult = imagesApiSlice.endpoints.getImages.select()

// creates memoized selector
const selectImagesData = createSelector(
    selectImagesResult,
    imagesResult => imagesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllImages,
    selectById: selectImageById,
    selectIds: selectImageIds
    // Pass in a selector that returns the images slice of state
} = imagesAdapter.getSelectors(state => selectImagesData(state) ?? initialState)