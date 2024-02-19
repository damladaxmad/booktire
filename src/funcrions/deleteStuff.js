import axios from "axios";
import { useSelector } from "react-redux";
import swal from "sweetalert";

export const deleteFunction = (title, name, url, token, fun) => {
    swal({
      title: title,
      text: `Are you sure to delete ${name}?`,
      icon: "warning",
      buttons: {
        cancel : 'No',
        confirm : {text:'Yes',className:'sweet-warning'},
    }

    }).then((response) => {
      if (response) {
        if (title == "Delete Transaction"){
         return axios.delete(url, {
            headers: {
              "authorization": token
            }
          }).then((res)=> {
            swal({text: `You have successfully deleted ${name}`,
            icon:"success", timer: "2000"})
            fun(res?.data?.data?.transaction)
          }).catch((err) => {
            swal({text: err?.response?.data?.message,
        icon:"error", timer: "2000"})
          })

        }
        axios.post(url, {},{
          headers: {
            "authorization": token
          }
        }).then(()=> {
          swal({text: `You have successfully deleted ${name}`,
          icon:"success", timer: "2000"})
          fun()
        }).catch((err) => {
          swal({text: err?.response?.data?.message,
      icon:"error", timer: "2000"})
        })
        
      }
    })
  }