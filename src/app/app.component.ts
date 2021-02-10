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
  loginmode: boolean = false;
  Form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private errorService: ErrorService
  ) {}

  error;
  msg;
  errmsgs = this.errorService.errormsg;
  weakpassword: boolean = false;

  alertclose() {
    this.msg = "";
    this.error = "";
    this.weakpassword = false;
  }

  ngOnInit() {
    this.Form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(4)]]
    });
  }

  onmodeswitch() {
    this.loginmode = !this.loginmode;
  }

  onSubmit() {
    if (this.Form.valid) {
      const email = this.Form.value.email;
      const password = this.Form.value.password;

      if (this.loginmode) {
        this.SignIn(email, password).subscribe(
          res => {
            console.log(res);
            this.error = "";
            this.msg = "Sign in";
          },
          err => {
            console.log(err);

            if (!err.error || !err.error.error)
              this.error = this.errmsgs["UNKOWN"];
            else this.error = this.errmsgs[err.error.error.message];
          }
        );
      } else {
        this.SignUp(email, password).subscribe(
          res => {
            console.log(res);
            this.error = "";
            this.msg = "Created Account ";
          },
          err => {
            console.log(err);
            if (
              err.error.error.message ==
              "WEAK_PASSWORD : Password should be at least 6 characters"
            ) {
              this.weakpassword = true;
            }

            if (!err.error || !err.error.error)
              this.error = this.errmsgs["UNKOWN"];
            else this.error = this.errmsgs[err.error.error.message];
          }
        );
      }
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
