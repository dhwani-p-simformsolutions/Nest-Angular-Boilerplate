import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";

export function showErrorToast(toast: ToastrService, err: HttpErrorResponse) {
    let message = "";
    if (err.error) {
        const error = err.error;
        if (error.message) {
            message = error.message;
        } else {
            message = "something went wrong!";
        }
    } else if (err.message) {
        message = err.message;
    }
    else {
        message = "something went wrong!";
    }
    toast.error(message);
}