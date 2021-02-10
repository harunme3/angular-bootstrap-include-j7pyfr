import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Observable } from "rxjs";

import { AuthRes } from "./auth-res.interface";
import { config } from "./config";
import { ErrorService } from "./error.service";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  loginmode: boolean = true;
  Form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private errorService: ErrorService
  ) {}

  error;
  errmsgs = this.errorService.errormsg;

  ngOnInit() {
    this.Form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  onmodeswitch() {
    this.loginmode = !this.loginmode;
  }

  onSubmit() {
    if (this.Form.valid) {
      const email = this.Form.value.email;
      const password = this.Form.value.password;

      let authobservable: Observable<AuthRes>;

      if (this.loginmode) {
        authobservable = this.SignIn(email, password);
      } else {
        authobservable = this.SignUp(email, password);
      }
      authobservable.subscribe(
        res => {
          console.log(res);
          this.error = "";
            

        },
        err => {
          console.log(err);

          if (!err.error || !err.error.error)
            this.error = this.errmsgs["UNKOWN"];
          else this.error = this.errmsgs[err.error.error.message];
        }
      );
    }
  }

  SignUp(email, password) {
    return this.http.post<AuthRes>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${
        config.API_KEY
      }`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    );
  }

  SignIn(email, password) {
    return this.http.post<AuthRes>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
        config.API_KEY
      }`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    );
  }
}
