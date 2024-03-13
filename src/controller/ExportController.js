const Excel = require("exceljs");
const BookRoom = require("../models/bookRoomModel");
const BookTour = require("../models/bookTourModel");
const OrderFood = require("../models/OrderModel");

const exportToExcel = async (req, res) => {
  try {
    let data;
    let sheetName;
    let columns;

    // Lấy loại dữ liệu từ query parameter
    const { dataType } = req.query;

    // Lấy ID từ req.params.id
    const { id } = req.params;

    // Kiểm tra loại dữ liệu và lấy dữ liệu tương ứng từ database
    switch (dataType) {
      case "bookTour":
        data = await BookTour.find({ _id: id }); // Lấy dữ liệu cho ID của bookTour
        sheetName = "BookTours";
        columns = [
          { header: "Tour Name", key: "tourName", width: 30 },
          { header: "User Name", key: "userName", width: 30 },
          { header: "Phone Number", key: "phoneNumber", width: 30 },
          { header: "Email", key: "email", width: 30 },
          { header: "Price", key: "price", width: 30 },
        ];
        break;
      case "bookRoom":
        data = await BookRoom.find({ _id: id }); // Lấy dữ liệu cho ID của bookRoom
        sheetName = "BookRooms";
        columns = [
          { header: "Room Name", key: "hotelName", width: 30 },
          { header: "User Name", key: "userName", width: 30 },
          { header: "Phone Number", key: "phoneNumber", width: 30 },
          { header: "Email", key: "email", width: 30 },
          { header: "Price", key: "price", width: 30 },
        ];
        break;
      case "orderFood":
        data = await OrderFood.find({ _id: id }); // Lấy dữ liệu cho ID của orderFood
        sheetName = "OrderFoods";
        columns = [
          { header: "Restaurant Name", key: "restaurantName", width: 30 },
          { header: "User Name", key: "userName", width: 30 },
          { header: "Phone Number", key: "phoneNumber", width: 30 },
          { header: "Email", key: "email", width: 30 },
          { header: "Price", key: "price", width: 30 },
        ];
        break;
      default:
        return res.status(400).json({ message: "Invalid data type" });
    }

    // Tạo một workbook mới
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Điền dữ liệu vào worksheet
    worksheet.columns = columns;

    data.forEach((booking) => {
      worksheet.addRow({
        ...booking._doc, // Lấy tất cả thuộc tính của đối tượng booking
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + `${sheetName}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const exportAllToExcel = async (req, res) => {
  try {
    let data;
    let sheetName;
    let columns;

    // Lấy loại dữ liệu từ query parameter
    const { dataType } = req.query;

    // Kiểm tra loại dữ liệu và lấy dữ liệu tương ứng từ database
    switch (dataType) {
      case "bookTour":
        data = await BookTour.find();
        sheetName = "BookTours";
        columns = [
          { header: "Tour Name", key: "tourName", width: 30 },
          { header: "User Name", key: "userName", width: 30 },
          { header: "Phone Number", key: "phoneNumber", width: 30 },
          { header: "Email", key: "email", width: 30 },
          { header: "Price", key: "price", width: 30 },
        ];
        break;
      case "bookRoom":
        data = await BookRoom.find();
        sheetName = "BookRooms";
        columns = [
          { header: "Room Name", key: "hotelName", width: 30 },
          { header: "User Name", key: "userName", width: 30 },
          { header: "Phone Number", key: "phoneNumber", width: 30 },
          { header: "Email", key: "email", width: 30 },
          { header: "Price", key: "price", width: 30 },
        ];
        break;
      case "orderFood":
        data = await OrderFood.find();
        sheetName = "OrderFoods";
        columns = [
          { header: "Restaurant Name", key: "restaurantName", width: 30 },
          { header: "User Name", key: "userName", width: 30 },
          { header: "Phone Number", key: "phoneNumber", width: 30 },
          { header: "Email", key: "email", width: 30 },
          { header: "Price", key: "price", width: 30 },
        ];
        break;
      default:
        return res.status(400).json({ message: "Invalid data type" });
    }

    // Tạo một workbook mới
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    // Điền dữ liệu vào worksheet
    worksheet.columns = columns;

    data.forEach((booking) => {
      worksheet.addRow({
        ...booking._doc, // Lấy tất cả thuộc tính của đối tượng booking
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + `${sheetName}.xlsx`,
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { exportToExcel, exportAllToExcel };
