import * as yup from 'yup'

export const postSchema = yup.object().shape({
  title: yup.string().min(2).max(30).required(),
  text: yup.string().min(2).required(),
})
