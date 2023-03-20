import { Router } from "express";
import * as controller from '../controllers/appController.js';
import Auth from '../middleware/auth.js'
import multer from 'multer'
import path from 'path'

const router = Router();

// configuration for multer
const multerStorage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (request, file, cb) => {
        const ext = file.mimetype.split('/')[1]
        cb(null, file.originalname)
    }
})

//multer filter

const multerFilter = (request, file, cb) =>{
    if(file.mimetype.split('/')[1] == 'pdf'){
        cb(null, true)
    }else{
        cb(new Error('not a pdf file'), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

/** Post Methods */

router.route('/register').post(controller.register)
router.route('/login').post(controller.login)
router.route('/getUserDetails/:username').get(controller.getUserDetails)
router.route('/updateUser').put(Auth, controller.updateUserDetails)
router.route('/uploadStudentMaterial').post(Auth, upload.single('myfile'),controller.uploadStudentMaterial)

    upload.single()

export default router;
