'use client'
import React, { useEffect, useRef, useState } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getSession, signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Formik, Form } from "formik";
import * as Yup from "yup";

// Custom
import { useHandleMessage } from "hooks";
import { loginVerify, userLogin } from "helper/apis/login";
import { Spinner, Button } from "components/UI";
import { Input } from "components/formik";
import { Logo } from "components/icons";
import { getFirstError } from "utils/utils";
import Link from "next/link";
import axiosInstance from "auth/axiosInstance";
import config from "config/config";
import axios from "axios";
import { setTheme } from "store/ThemeSlice";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
  const [imageBanner, setImageBanner] = useState('')
  const [headerContent, setHeaderContent] = useState('')
  const [dataFromPartner, setDataFromPartner] = useState([])
  const ref = useRef(null)
  const refOtp = useRef(null)
  const { t } = useTranslation("common");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleMessage = useHandleMessage();
  const [token, setToken] = useState("");
  const [otp, setOtp] = useState([]);
  const OTPLength = otp?.filter(e => e)?.length;
  const initialValues = {
    email: "",
    password: "",
  };


  const loginValidation = Yup.object().shape({
    email: Yup.string().required(t("email_is_required_key")).trim(),
    password: Yup.string()
      .min(6, t("password_must_be_at_least_6_characters_key"))
      .required(t("password_is_required_key"))
      .trim(),
  });

  const onSubmit = async (values) => {
    setIsLoading(true);

    if (OTPLength != 4) {
      const submitData = {
        email: values.email,
        password: values.password,
      };
      try {
        const { data } = await userLogin(submitData);
        const token = data?.token;
        setToken(token);
      } catch ({ data }) {
        handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
      } finally {
        setIsLoading(false);
      }
    } else {
      const submitData = {
        code: otp?.join(""),
        token
      };
      try {
        const response = await loginVerify(submitData);
        const userData = { ...response.data };
        if (userData?.role[0] == "admin") {
          await signIn("credentials", {
            redirect: false,
            callbackUrl: "/",
            user: JSON.stringify(userData),
          });
          router.push(`/`);
        } else {
          const profileResponse = await axiosInstance(`${config.apiGateway.API_URL_TELGANI}/v2/user/profile`, { headers: { Authorization: `Bearer ${userData.meta.access_token}` } });


          const profile = profileResponse.data;
          const corporate = profile.data.details.corporate;
          userData.corporate = corporate;
          await signIn("credentials", {
            redirect: false,
            callbackUrl: "/",
            user: JSON.stringify(userData),
          });
          console.log(userData);
          router.push(`/corporate/book-car`);
        }
      } catch ({ data }) {
        handleMessage(getFirstError(data?.errors) || data?.message || data?.error);
        router.push(`/corporate/book-car`);
      } finally {
        setIsLoading(false);
      }
    }
  };

 
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try { 
        
  //         //   // .get(`https://api.telgani.com/api/v1/partner/y-renting-cars`) // https://y-renting-cars.telgani.com
  // //   .get(`https://api.telgani.com/api/v1/partner/saudia`)  // https://saudia.telgani.com
  // //   // .get(`https://api.telgani.com/api/v1/partner/flynas`)  // https://flynas.telgani.com
  //   //   console.log('first use effect')
  //       const subDomain = window.location.host.split('.')[0];
  //       const response = await axios.get(`https://api.telgani.com/api/v1/partner/y-renting-cars`) // https://y-renting-cars.telgani.com);
  //       const { data } = response?.data || {};
        
  //       if (data) {

  //         setDataFromPartner(response?.data?.data);
  //       } else {
  //         setDataFromPartner({})
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   fetchData();
  // }, [setDataFromPartner]);



   useEffect(() => {
    setImageBanner(localStorage.getItem('imageBanner'));
    setHeaderContent(localStorage.getItem('headerContent'));
  }, [])


  return (
    <div className={`flex justify-center h-screen dark:bg-dark dark:bg-gray-800 `}>
      {/* Start Logo  */}
      <div className="hidden bg-center bg-cover md:block md:w-1/2 relative">
        <div className="absolute top-0 left-0 h-full w-full">
          <img src={`${imageBanner ? imageBanner : '/images/building-1.jpg'}`} className="h-full w-full" alt="" />
          <div className="absolute bg-black/90 w-full h-full top-0 left-0"></div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="flex flex-col items-center justify-center h-screen ">
            <Logo className="text-white w-52" content={headerContent} />
          </div>
        </div>
      </div>
      {/* End Logo  */}
 
      {/* Start Login Code  */}
      <div className="flex justify-center items-center w-full h-full">

          <div className="w-full md:w-1/2  ">
            <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white">
              {t("sign_in_now_key")}
            </h1>
            <p className="mb-2 text-sm text-gray-500 dark:text-white">
              {t("enter_your_email_and_password_to_sign_in_key")}
            </p>
            <Formik
              initialValues={initialValues}
              validationSchema={loginValidation}
              onSubmit={onSubmit}
            >
              {(formikProps) => (
                <Form className="flex flex-col">
                  <div className="mb-4">
                    <Input
                      label={t("email_address_key")}
                      name="email"
                      // type="email"
                      {...formikProps}
                    />
                  </div>
                  <div className="mb-2">
                    <Input
                      label={t("password_key")}
                      name="password"
                      type="password"
                      {...formikProps}
                    />
                  </div>

                  {token && (

                    <>

                      <p className="dark:text-gray-300">{t("otp_key")}</p>
                      <div className="flex items-center justify-start gap-4 w-94">
                        {Array.from({ length: 4 }).map((_, index) => (
                          <div key={index} className="w-14 h-14">
                            <input
                              
                              autoFocus={index == 0}
                              value={otp[index] || ''}
                              onChange={(e) => {
                                const inputValue = e.target.value.slice(-1) || "";
                                if (!isNaN(inputValue)) {
                                  setOtp(prevOtp => {
                                    const updatedOtp = [...prevOtp];
                                    updatedOtp[index] = inputValue;
                                    return updatedOtp;
                                  });
                                  e?.target?.parentElement.nextSibling && inputValue && e.target.parentElement.nextSibling.firstChild.focus();
                                  !inputValue && e.target.parentElement.previousSibling && e.target.parentElement.previousSibling.firstChild.focus();
                                }
                              }}
                              className={`flex items-center justify-center w-full h-full px-2 text-lg text-center bg-gray-100 border-2 border-gray-200 outline-none md:px-5 rounded-xl focus:bg-gray-50 hover:bg-gray-50 ${dataFromPartner?.data?.data?.main_color_hex ? `hover:border-[${dataFromPartner?.data?.data.main_color_hex}] focus:border-[${dataFromPartner?.data?.data.main_color_hex}]` : 'hover:border-primary focus:border-primary'}`}
                              
                            />
                          </div>
                        ))}
                      </div>

                      <p className="flex gap-2">
                        <span  className="dark:text-gray-300">{t("didnt_receive_code_key")}</span>

                        <button ref={refOtp} type={OTPLength == 4 ? "button" : "submit"} disabled={OTPLength == 4} className='bg-transparent text-primary'>{t("resend_key")}</button>
                      </p>

                    </>
                  )}


                  <Button
                    disabled={isLoading || (token && OTPLength != 4)}
                    classNamee={`w-full mt-6 btn--primary'}`}
                    type="submit"
                    >
                    {isLoading ? (
                      <>
                        <Spinner className="w-4 h-4 mr-3 rtl:ml-3" />
                        {t("loading_key")}
                      </>
                    ) : (
                      t("sign_in_now_key")
                    )}
                  </Button>
                  <Link href="/forgot-password">
                    <span ref={ref} className='mt-4 cursor-pointer text-primary'>

                      {t("forgot_password_key")}
                    </span>
                  </Link>
                </Form>
              )}
            </Formik>
          </div>
      </div>
      {/* End Login Code  */}

    </div>
  );
};

export default Login;

Login.getLayout = function PageLayout(page) {
  return <>{page}</>;
};


export const getServerSideProps = async (context) => {
  const session = await getSession({ req: context.req });
  const routeUrl = context.locale === 'ar' ? '/' : `/${context.locale}/`;

  // const destination = context?.query?.callBackUrl ? `/${context?.query?.callBackUrl}` : "";

  if (session) {
    const role = session?.user?.role[0];
    const destination = role == 'admin' ? "" : 'corporate';
    return {
      redirect: {
        destination: `${routeUrl}${destination}`,
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        session,
        ...(await serverSideTranslations(context.locale, ['common'])),
      },
    };
  }
};

