// import { toast } from "react-hot-toast"

// import rzpLogo from "../../assets/Logo/rzp_logo.png"
// import { resetCart } from "../../slices/cartSlice"
// import { setPaymentLoading } from "../../slices/courseSlice"
// import { apiConnector } from "../apiConnector"
// import { studentEndpoints } from "../apis"

// const {
//   COURSE_PAYMENT_API,
//   COURSE_VERIFY_API,
//   SEND_PAYMENT_SUCCESS_EMAIL_API,
// } = studentEndpoints

// // Load the Razorpay SDK from the CDN
// function loadScript(src) {
//   return new Promise((resolve) => {
//     const script = document.createElement("script")
//     script.src = src
//     script.onload = () => {
//       resolve(true)
//     }
//     script.onerror = () => {
//       resolve(false)
//     }
//     document.body.appendChild(script)
//   })
// }
// function loadScript(src) {
//   return new Promise((resolve, reject) => {
//     const existingScript = document.querySelector(`script[src="${src}"]`);

//     if (existingScript) {
//       resolve(existingScript);
//     } else {
//       const script = document.createElement("script");
//       script.src = src;

//       script.onload = () => {
//         resolve(script);
//       };

//       script.onerror = (error) => {
//         reject(error);
//       };

//       document.body.appendChild(script);
//     }
//   });
// }

// // Buy the Course
// export async function BuyCourse(
//   token,
//   courses,
//   user_details,
//   navigate,
//   dispatch
// ) {
//   const toastId = toast.loading("Loading...")
//   try {
//     console.log("Hariom----------------------->4");
//     // Loading the script of Razorpay SDK
//     const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
//     console.log("Hariom----------------------->5");
//     if (!res) {
//       toast.error(
//         "Razorpay SDK failed to load. Check your Internet Connection."
//       )
//       return
//     }

//     // Initiating the Order in Backend
//     const orderResponse = await apiConnector(
//       "POST",
//       COURSE_PAYMENT_API,
//       {
//         courses,
//       },
//       {
//         Authorization: `Bearer ${token}`,
//       }
//     )

//     if (!orderResponse.data.success) {
//       throw new Error(orderResponse.data.message)
//     }
//     console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data)

//     // Opening the Razorpay SDK
//     const options = {
//       key: process.env.RAZORPAY_KEY,
//       currency: orderResponse.data.data.currency,
//       amount: `${orderResponse.data.data.amount}`,
//       order_id: orderResponse.data.data.id,
//       name: "StudyNotion",
//       description: "Thank you for Purchasing the Course.",
//       image: rzpLogo,
//       prefill: {
//         name: `${user_details.firstName} ${user_details.lastName}`,
//         email: user_details.email,
//       },
//       handler: function (response) {
       
//         sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
//         verifyPayment({ ...response, courses }, token, navigate, dispatch)
//       },
//     }
//     const paymentObject = new window.Razorpay(options)
//  console.log("Hariom----------------------->");
//     paymentObject.open()
//     paymentObject.on("payment.failed", function (response) {
//       toast.error("Oops! Payment Failed.")
//       console.log("Hariom----------------------->1");
//       console.log(response.error)
//     })
//   } catch (error) {
//     console.log("Hariom----------------------->2");
//     console.log("PAYMENT API ERROR............", error)
//     toast.error("Could Not make Payment.")
//   }
//   toast.dismiss(toastId)
// }

// // Verify the Payment
// async function verifyPayment(bodyData, token, navigate, dispatch) {
//   const toastId = toast.loading("Verifying Payment...")
//   console.log("Hariom----------------------->3");
//   dispatch(setPaymentLoading(true))
//   try {
//     const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
//       Authorization: `Bearer ${token}`,
//     })

//     console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)

//     if (!response.data.success) {
//       throw new Error(response.data.message)
//     }

//     toast.success("Payment Successful. You are Added to the course ")
//     navigate("/dashboard/enrolled-courses")
//     dispatch(resetCart())
//   } catch (error) {
//     console.log("PAYMENT VERIFY ERROR............", error)
//     toast.error("Could Not Verify Payment.")
//   }
//   toast.dismiss(toastId)
//   dispatch(setPaymentLoading(false))
// }

// // Send the Payment Success Email
// async function sendPaymentSuccessEmail(response, amount, token) {
//   try {
//     console.log("Hariom----------------------->4");
//     await apiConnector(
//       "POST",
//       SEND_PAYMENT_SUCCESS_EMAIL_API,
//       {
//         orderId: response.razorpay_order_id,
//         paymentId: response.razorpay_payment_id,
//         amount,
//       },
//       {
//         Authorization: `Bearer ${token}`,
//       }
//     )
//   } catch (error) {
//     console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
//   }
// }
// frontend code...

import { toast } from "react-hot-toast";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { resetCart } from "../../slices/cartSlice";
import { setPaymentLoading } from "../../slices/courseSlice";
import { apiConnector } from "../apiConnector";
import { studentEndpoints } from "../apis";

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
} = studentEndpoints;

function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

export async function BuyCourse(token, courses, user_details, navigate, dispatch) {
  const toastId = toast.loading("Loading...");
  try {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      toast.error("Razorpay SDK failed to load. Check your Internet Connection.");
      return;
    }

    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      { Authorization: `Bearer ${token}` }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }
    console.log("user_details",user_details);
    console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data);
           
       
    const options = {
      key: "rzp_test_aHgGdstYhFufxj",
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "StudyNotion",
      description: "Thank you for Purchasing the Course.",
      image: rzpLogo,
      prefill: {
        name: `${user_details.firstName} ${user_details.lastName}`,
        email: user_details.email,
      },
      handler: function (response) {
        console.log("Paytement success")
        sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token);
        verifyPayment({ ...response, courses }, token, navigate, dispatch);
      },
    };
  console.log(options);
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed.");
      console.log(response.error);
    });
  } catch (error) {
    console.log("PAYMENT API ERROR............", error);
    toast.error("Could Not make Payment.");
  }
  toast.dismiss(toastId);
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...");
  dispatch(setPaymentLoading(true));
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    });

    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response);

    if (!response.data.success) {
      throw new Error(response.data.message);
    }

    toast.success("Payment Successful. You are Added to the course ");
    navigate("/dashboard/enrolled-courses");
    dispatch(resetCart());
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error);
    toast.error("Could Not Verify Payment.");
  }
  toast.dismiss(toastId);
  dispatch(setPaymentLoading(false));
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR............", error);
  }
}
