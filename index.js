function dom(selector) {
  return document.querySelector(selector);
}
// Lớp đối tượng
function Payroll(
  account,
  name,
  email,
  password,
  datepicker,
  basicSalary,
  position,
  workTime
) {
  this.account = account;
  this.name = name;
  this.email = email;
  this.password = password;
  this.datepicker = datepicker;
  this.basicSalary = basicSalary;
  this.position = position;
  this.workTime = workTime;
}
// prototype tính lương
Payroll.prototype.totalSalary = function () {
  if (this.position === "Sếp") {
    return this.basicSalary * 3;
  }
  if (this.position === "Trưởng phòng") {
    return this.basicSalary * 2;
  }
  return this.basicSalary * 1;
};
// prototype xếp loại nhân viên
Payroll.prototype.ratting = function () {
  let rate = this.workTime;
  if (rate >= 192) {
    return "Xuất sắc";
  }
  if (rate >= 176) {
    return "Giỏi";
  }
  if (rate >= 160) {
    return "Khá";
  }
  return "Trung bình";
};
//============================================================
let payrolls = [];
init();
function init() {
  // lấy dữ liệu student từ localStorage
  payrolls = JSON.parse(localStorage.getItem("payrolls")) || []; // dữ liệu a hoặc dữ liệu false value gán lại cho payrolls
  console.log("payrolls trước khi map: ", payrolls);
  // do Json có nhược điểm không lưu trữ được hàm. Khi lấy xuống thì mất hàm
  // lúc này payrolls đang ở dạng chuỗi nên ta duyệt phần tử về dạng object
  payrolls = payrolls.map((payroll) => {
    return new Payroll(
      payroll.account,
      payroll.name,
      payroll.email,
      payroll.password,
      payroll.datepicker,
      payroll.basicSalary,
      payroll.position,
      payroll.workTime
    );
  });
  console.log("payrolls sau khi map: ", payrolls);
  display(payrolls);
}

// Thêm nhân viên mới và in ra table
// 1. Tạo sự kiện cho button addStaff Thêm nhân viên
function addUser() {
  let account = dom("#tknv").value;
  let name = dom("#name").value;
  let email = dom("#email").value;
  let password = dom("#password").value;
  let datepicker = dom("#datepicker").value;
  let basicSalary = +dom("#luongCB").value;
  let position = dom("#chucvu").value;
  let workTime = +dom("#gioLam").value;
  // tạo object
  let payroll = new Payroll(
    account,
    name,
    email,
    password,
    datepicker,
    basicSalary,
    position,
    workTime
  );
  // xét thông tin nhập sai
  let isValid = validateForm();
  if (!isValid) {
    return;
  }
  // array hứng object
  payrolls.push(payroll);
  localStorage.setItem("payrolls", JSON.stringify(payrolls));
  //hiển thị ra giao diện
  display(payrolls);
  // reset sau khi nhập
  resetForm();
}

// 2. Xoá nhân viên
function deleteStaff(accountID) {
  payrolls = payrolls.filter((payroll) => {
    return payroll.account !== accountID;
  });
  localStorage.setItem("payrolls", JSON.stringify(payrolls));
  display(payrolls);
}

// 3. search : tìm danh sách loại nhân viên. Tìm theo giỏi hoặc khá hoặc trung bình
function searchType() {
  const type = dom("#searchName").value;
  let listTypies = payrolls.filter((payroll) => {
    let newType = payroll.ratting().toLowerCase();
    return newType.includes(type);
  });
  display(listTypies);
}

// 4. Cập nhật thông thin
// 4.1 tạo button edit
function addButtonEdit(accountID) {
  let payroll = payrolls.find((payroll) => {
    return payroll.account === accountID;
  });

  // đưa thông tin lên form điền
  dom("#tknv").value = payroll.account;
  dom("#name").value = payroll.name;
  dom("#email").value = payroll.email;
  dom("#password").value = payroll.password;
  dom("#datepicker").value = payroll.datepicker;
  dom("#luongCB").value = payroll.basicSalary;
  dom("#chucvu").value = payroll.position;
  dom("#gioLam").value = payroll.workTime;
  // không cho phép thay đổi account và không thêm nhân viên tại bước này
  dom("#tknv").disabled = true;
  dom("#btnThemNV").disabled = true;
}

// 2. cập nhật thông tin người dùng thay đổi
function updateNew() {
  // dom
  let account = dom("#tknv").value;
  let name = dom("#name").value;
  let email = dom("#email").value;
  let password = dom("#password").value;
  let datepicker = dom("#datepicker").value;
  let basicSalary = +dom("#luongCB").value;
  let position = dom("#chucvu").value;
  let workTime = +dom("#gioLam").value;
  // tạo object
  let payroll = new Payroll(
    account,
    name,
    email,
    password,
    datepicker,
    basicSalary,
    position,
    workTime
  );
  let isValid = validateForm();
  if (!isValid) {
    return;
  }
  // cập nhật thông tin người dùng thay đổi
  let index = payrolls.findIndex((item) => {
    return item.account === payroll.account;
  });
  payrolls[index] = payroll;
  //   localStorage.setItem("payrolls", JSON.stringify(payrolls));
  // hiển thị ra table
  display(payrolls);
  // reset
  resetForm();
}
//============================================================
// TÁC VỤ HỖ TRỢ
// In thông tin nhân viên vừa thêm ra table
function display(payrolls) {
  let html = payrolls.reduce((result, payroll) => {
    return (
      result +
      `
      <tr>
          <td>${payroll.account}</td>
          <td style="max-width: 100px">${payroll.name}</td>
          <td style="max-width: 200px">${payroll.email}</td>
          <td>${payroll.datepicker}</td>
          <td>${payroll.position}</td>
          <td>${payroll.totalSalary()}</td>
          <td>${payroll.ratting()}</td>
          <td style="padding: 5px 0px">
              <button 
                class="btn btn-success col-8" 
                onclick="addButtonEdit('${payroll.account}')"  
                data-toggle = "modal"
                data-target = "#myModal"
                >
                Edit
              </button>
              <button 
                class="btn btn-danger col-8 mt-1" 
                onclick="deleteStaff('${payroll.account}')"
                >
                Delete
              </button>
          </td>
      </tr>
      `
    );
  }, "");
  dom("#tableDanhSach").innerHTML = html;
}

// reset giúp form trở lại ban đầu
function resetForm() {
  dom("#tknv").value = "";
  dom("#name").value = "";
  dom("#email").value = "";
  dom("#password").value = "";
  dom("#datepicker").value = "";
  dom("#luongCB").value = "";
  dom("#chucvu").value = "Chọn chức vụ";
  dom("#gioLam").value = "";

  dom("#tknv").disabled = false;
  dom("#btnThemNV").disabled = false;
}
//============================================================
// VALIDATION : KIỂM TRA THÔNG TIN NHẬP THEO ĐỊNH DẠNG YÊU CẦU
//Account: Tài khoản tối đa 4 - 6 ký số, không để trống
function validateAccount() {
  let account = dom("#tknv").value;
  let spanEl = dom("#tbTKNV");
  if (!account) {
    // Kiểm tra chuỗi trống
    spanEl.innerHTML = "Không để trống tài khoản";
    return false;
  }
  // Tài khoản tối đa 4 - 6 ký số
  if (account.length > 6 || account.length < 4) {
    spanEl.innerHTML = "tài khoản từ 4 đến 6 ký tự";
    return false;
  }
  spanEl.innerHTML = "";
  return true;
}

// name: tên nhân viên phải là chữ, không để trống
function validateName() {
  let name = dom("#name").value;
  let spanEl = dom("#tbTen");
  if (!name) {
    spanEl.innerHTML = "Không để trống tên";
    return false;
  }
  function removeAscent(str) {
    if (str === null || str === undefined) return str;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
  }
  // function isValid (string) {
  var re = /^[a-zA-Z!@#\$%\^\&*\)\(+=._-]{2,}$/g; // regex here
  if (!re.test(removeAscent(name))) {
    // tên nhân viên phải là chữ
    spanEl.innerHTML = "Tên nhân viên chỉ chứa chữ";
    return false;
  }
  spanEl.innerHTML = "";
  return true;
}
//email: theo định dạng email
function validateEmail() {
  let email = dom("#email").value;
  let spanEl = dom("#tbEmail");
  if (!email) {
    // Kiểm tra chuỗi trống
    spanEl.innerHTML = "Không để trống email";
    return false;
  }
  // kiểm tra định dạng email
  let regex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!regex.test(email)) {
    spanEl.innerHTML = "email không đúng định dạng";
    return false;
  }
  spanEl.innerHTML = "";
  return true;
}

//password: từ 6-10 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt), không để trống
function validatePassword() {
  let password = dom("#password").value;
  let spanEl = dom("#tbMatKhau");
  if (!password) {
    // Kiểm tra chuỗi trống
    spanEl.innerHTML = "Không để trống password";
    return false;
  }
  // từ 6-10 ký tự
  if (password.length > 10 || password.length < 6) {
    spanEl.innerHTML = "password từ 6-10 ký tự ";
    return false;
  }
  /// kiểm tra: chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt
  let regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    spanEl.innerHTML =
      "password phải chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt";
    return false;
  }
  spanEl.innerHTML = "";
  return true;
}
//datepicker: Ngày làm không để trống, định dạng mm/dd/yyyy
function validateDatepicker() {
  let datepicker = dom("#datepicker").value;
  let spanEl = dom("#tbNgay");
  if (!datepicker) {
    // Kiểm tra chuỗi trống
    spanEl.innerHTML = "Không để trống giờ làm";
    return false;
  }
  // kiểm tra định dạng: mm/dd/yyyy
  let regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
  if (!regex.test(datepicker)) {
    spanEl.innerHTML = "Ngày làm không đúng định dạng";
    return false;
  }
  spanEl.innerHTML = "";
  return true;
}
// lương cơ bản: Mức lương trong khoảng 1.000.000 - 20.000.000 vnd, không dể trống
function validateSalary() {
  let basicSalary = dom("#luongCB").value;
  let spanEl = dom("#tbLuongCB");
  if (!basicSalary) {
    // Kiểm tra chuỗi trống
    spanEl.innerHTML = "Không để trống lương cơ bản";
    return false;
  }
  if (basicSalary < 1000000 || basicSalary > 20000000) {
    spanEl.innerHTML = "Mức lương trong khoảng 1.000.000 - 20.000.000 vnd";
    return false;
  }
  spanEl.innerHTML = "";
  return true;
}
//position: Chức vụ phải chọn chức vụ hợp lệ (Giám đốc, Trưởng Phòng, Nhân Viên)
function validatePosition() {
  let position = dom("#chucvu").value;
  let spanEl = dom("#tbChucVu");
  if (position === "Chọn chức vụ") {
    // Kiểm tra chuỗi trống
    spanEl.innerHTML = "Không để trống Chức vụ";
    return false;
  }
  spanEl.innerHTML = "";
  return true;
}
//gioLam: + Số giờ làm trong tháng 80 - 200 giờ, không để trống
function validateWorkTime() {
  let workTime = dom("#gioLam").value;
  let spanEl = dom("#tbGiolam");
  if (!workTime) {
    // Kiểm tra chuỗi trống
    spanEl.innerHTML = "Không để trống giờ làm";
    return false;
  }
  if (workTime < 80 || workTime > 200) {
    spanEl.innerHTML = "Giờ làm chỉ từ 800 - 200 giờ";
    return false;
  }
  spanEl.innerHTML = "";
  return true;
}

function validateForm() {
  isValid = true;
  isValid =
    validateAccount() &
    validateName() &
    validateEmail() &
    validatePassword() &
    validateDatepicker() &
    validateSalary() &
    validatePosition() &
    validateWorkTime();
  if (!isValid) {
    alert("Form không hợp lệ");
    return false;
  }
  return true;
}
