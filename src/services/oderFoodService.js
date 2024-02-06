const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const oderFoodService = async (email) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  let info = await transporter.sendMail({
    from: '"GO TRAVEL" <gotraveldev@gmail.com>',
    to: email,
    subject: "SEND FROM GOTRAVEL",
    text: "GO TRAVEL",
    html: "<div><b>Cảm ơn bạn đã đặt đồ ăn tại nhà hàng bên mình !</b>Send email from GO TRAVEL</div>",
  });
  return info;
};

module.exports = oderFoodService;
