"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

// export async function updateBooking(id, updatedFields) {
//   const { data, error } = await supabase
//     .from("bookings")
//     .update(updatedFields)
//     .eq("id", id)
//     .select()
//     .single();

//   if (error) {
//     console.error(error);
//     throw new Error("Booking could not be updated");
//   }
//   return data;
// }

export async function deleteReservation(reservasionId) {
  const session = await auth();
  if (!session) throw new Error("You must log in first");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);
  if (!guestBookingIds.includes(reservasionId))
    throw new Error("You are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", reservasionId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must log in first");
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  const regex = /^[a-zA-Z0-9]{4,10}$/;
  if (!regex.test(nationalID))
    throw new Error("Invalid nationalID, please input again");

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("You must log in first");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  console.log(" bookingData is: ", bookingData);
  console.log(" newBooking is: ", newBooking);

  const { error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");
  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect("/cabins/thankyou");
}

export async function updateReservation(formData) {
  // console.log("formData is: ", formData);
  const session = await auth();
  if (!session) throw new Error("You must log in first");
  // console.log("session is: ", session);
  // console.log("session.user.guestId is: ", session.user.guestId);

  const numGuests2 = Number(formData.get("numGuests"));
  const observations2 = formData.get("observations");
  const reservationId2 = Number(formData.get("reservationId"));

  // console.log(
  //   "numGuests2 is: ",
  //   numGuests2,
  //   "observations2 is: ",
  //   observations2,
  //   "reservationId2 is: ",
  //   reservationId2
  // );

  const guestBookings = await getBookings(session.user.guestId);

  const guestBookingIds = guestBookings.map((booking) => booking.id);

  // console.log(" guestBookingIds: ", guestBookingIds);
  // console.log(" reservationId2: ", reservationId2);
  // console.log(
  //   " guestBookingIds.includes(Number (reservationId2)): ",
  //   guestBookingIds.includes(Number(reservationId2))
  // );

  if (!guestBookingIds.includes(reservationId2))
    throw new Error("You are not allowed to edit this booking");

  const { error } = await supabase
    .from("bookings")
    .update({
      numGuests: numGuests2,
      observations: observations2.slice(0, 1000),
    })
    .eq("id", reservationId2);

  if (error) throw new Error("Booking could not be updated");
  revalidatePath(`/account/reservations/edit/${reservationId2}`);

  redirect("/account/reservations");
}

/*
const regex = /^[a-zA-Z0-9]{4,10}$/;

// Example usage:
const nationalID = "ABC123";

if (regex.test(nationalID)) {
    console.log("National ID is valid");
} else {
    console.log("National ID is invalid");
}
*/

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

// fetch("http://localhost:3000/account/profile", {
//   headers: {
//     accept: "text/x-component",
//     "accept-language": "en-US,en;q=0.9",
//     "cache-control": "no-cache",
//     "content-type":
//       "multipart/form-data; boundary=----WebKitFormBoundary5Texzn7JSCE8tD9j",
//     "next-action": "13b99422c680d5670f7383871af665c3d5c764cb",
//     "next-router-state-tree":
//       "%5B%22%22%2C%7B%22children%22%3A%5B%22account%22%2C%7B%22children%22%3A%5B%22profile%22%2C%7B%22children%22%3A%5B%22__PAGE__%22%2C%7B%7D%2C%22%2Faccount%2Fprofile%22%2C%22refresh%22%5D%7D%2Cnull%2Cnull%5D%7D%2Cnull%2Cnull%2Ctrue%5D%7D%2Cnull%2Cnull%2Ctrue%5D",
//     pragma: "no-cache",
//     "sec-ch-ua":
//       '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
//     "sec-ch-ua-mobile": "?0",
//     "sec-ch-ua-platform": '"macOS"',
//     "sec-fetch-dest": "empty",
//     "sec-fetch-mode": "cors",
//     "sec-fetch-site": "same-origin",
//   },
//   referrer: "http://localhost:3000/account/profile",
//   referrerPolicy: "strict-origin-when-cross-origin",
//   body: '------WebKitFormBoundary5Texzn7JSCE8tD9j\r\nContent-Disposition: form-data; name="1_nationality"\r\n\r\n\r\n------WebKitFormBoundary5Texzn7JSCE8tD9j\r\nContent-Disposition: form-data; name="1_nationalID"\r\n\r\n7676hhhh\r\n------WebKitFormBoundary5Texzn7JSCE8tD9j\r\nContent-Disposition: form-data; name="0"\r\n\r\n["$K1"]\r\n------WebKitFormBoundary5Texzn7JSCE8tD9j--\r\n',
//   method: "POST",
//   mode: "cors",
//   credentials: "include",
// });
