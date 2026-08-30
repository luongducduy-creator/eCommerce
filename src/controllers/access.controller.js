'use strict'

class AccessController{

    signUp = async (req, res, next)=>{
          console.log(`[P]::signUp::`)
        try{
            console.log(`[P]::signUp::`,req.body)
            /*200 ok
             201 created
            */
            return res.status(201).json(await AccessService.signUp(req.body))
        }catch(error){
            next(error)
        }
    }
}
module.exports = new AccessController()