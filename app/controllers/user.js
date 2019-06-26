import validator from 'email-validator'
import jwt from 'jsonwebtoken'
import { TableFilterQuery } from 'sz-node-utils'
import User from '../models/user'

import { secret, errorObj, successObj } from '../../config/settings'

const exp = {
  add: (data) => {
    return new Promise((resolve) => {

      const {email, password, userType} = data

      if (!email || !password) {
        return resolve(
          {...errorObj, message: 'Please enter email and password'})
      }

      if (!validator.validate(email)) {
        return resolve({...errorObj, message: 'Invalid Email Address'})
      }

      const user = new User()
      user.email = email
      user.password = user.generateHash(password)

      if (userType) {
        user.userType = userType
      }

      user.save((err, doc) => {
        if (err) {
          console.error(err)
          return resolve({...errorObj, message: 'Error Saving User Details'})
        }
        resolve({...successObj, message: 'user added successfully', data: doc})
      })

    })
  },
  profile: (_id) => {
    return new Promise((resolve) => {
      User.findOne({_id})
          .exec((err, data) => {

            if (err) {
              console.error(err)
              return resolve({...errorObj, message: 'User not found'})
            }

            resolve({...successObj, data})
          })
    })
  },
  login: data => (new Promise((resolve) => {
    const {email, password} = data
    const error = 'wrong email or password'

    User.findOne({email})
        .exec(function (err, user) {

          if (!user) {
            return resolve({message: error, ...errorObj})
          }
          if (!user.validPassword(password)) {
            return resolve({...errorObj, message: error})
          }

          const JWTToken = jwt.sign(
            {
              _id: user._id,
              email: user.email,
              userType: user.userType,
            },
            secret,
            {
              expiresIn: '24h',
            })

          return resolve({
            ...successObj,
            token: JWTToken,
            user: {
              _id: user._id,
              email: user.email,
              userType: user.userType,
            },
          })
        })

  })),
  usersList: (data) => {
    return new Promise(async (resolve) => {
      const x = await TableFilterQuery(User, {...data})
      resolve(x)
    })
  },
  update: (data) => {
    return new Promise((resolve) => {
      User.findOne({_id: data._id})
          .exec((error, result) => {
            if (error || !result) return resolve({...errorObj, error})
            result.email = data.email
            result.password = result.generateHash(data.password)

            result.save((err, doc) => {
              if (err) return resolve({...errorObj, err})
              resolve({
                data: doc,
                message: 'User updated successfully',
                ...successObj,
              })
            })
          })

    })
  },
  delete: (_id) => {
    return new Promise((resolve) => {
      User.remove({_id})
          .exec((err, doc) => {
            if (err || !doc) return resolve({...errorObj, err})
            resolve({...successObj, message: 'User deleted successfully'})
          })
    })
  },
  removeAll: () => {
    return new Promise((resolve) => {
      User.remove({})
          .then((err) => {

            if (!err) {
              return resolve({...errorObj, err})
            }

            resolve({...successObj, data: []})

          })

    })
  },

}

export default exp
