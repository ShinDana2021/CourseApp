let root = document.querySelector('.root')
let api = 'http://localhost:3000/course'
let ellipsis = document.querySelector('.option-mobile')

function App(callback) {
    // xử lí render ra giao diện
    fetch(api)
    .then(function(respone) {
        return respone.json()
    })
    .then(
        callback
    )
}

//start App
App(render)


// handle btns in PC
// Nút thêm khóa học
let createBtn = document.getElementById('Add')
createBtn.onclick = function() {
    let name = document.querySelector('input[name= "name"]').value
    let description = document.querySelector('input[name= "decription"]').value
    if (name && description) {
        let data = {
            name,
            description
        }
        create(data,render)
        alert('Bạn đã thêm vào Database thành công')
    } else {
        let mess = document.querySelectorAll('.form-message-dk')
        mess.forEach(item => {
            let val = item.parentElement.querySelector('input').value
            if (val =="") {
                item.parentElement.querySelector('.form-message-dk').innerText = "Xin mời nhập lại vào ô trống"
                item.parentElement.querySelector('.label').classList.add('invalid')
                item.parentElement.querySelector('input').style.border="solid 1px red"
            }
        })
    }
}


// hàm render ra giao diện
function render(data) {
    console.log(data)
    let htmls = data.map(item => {
        return `
        <div class="item-course" id="item-${item.id}">
        <div class="container">
            <div>
                <h1>${item.name}</h1>
                <p>${item.description}</p>
            </div>
            <div class="icon-container">
                <i onclick ="document.querySelector('.modifier-input-${item.id}').style.display = 'block'" title="Chỉnh sửa" class="fa-solid fa-pen item-course-icon pen"></i>
                <i onclick ="deleteCourse(${item.id})" title="Xóa" class="fa-solid fa-trash-can item-course-icon "></i>
            </div>
            <i onclick="document.querySelector('.icon-container-mobile-${item.id}').style.display = 'block'" class="fa-solid fa-ellipsis option-mobile"></i>
            <div  class="icon-container-mobile icon-container-mobile-${item.id}">
                <div onclick="
                        document.querySelector('.modifier-input-${item.id}').style.display ='block'
                        document.querySelector('.icon-container-mobile-${item.id}').style.display = 'none'
                    ">
                    <span>Chỉnh sửa</span> 
                    <i title="Chỉnh sửa" class="fa-solid fa-pen item-course-icon"></i>
                </div>
                <div onclick ="deleteCourse(${item.id})">
                    <span>Xóa</span>
                    <i title="Xóa" class="fa-solid fa-trash-can item-course-icon"></i>
                </div>
                <div onclick=" document.querySelector('.icon-container-mobile-${item.id}').style.display = 'none' ">
                    <span>Thoát</span>
                    <i title="Thoát" class="fa-solid fa-xmark item-course-icon"></i>
                </div>
            </div>
        </div>
           
        <div class="modifier-input modifier-input-${item.id}" id="${item.id}">
            <div  class="input-group">
                <label class="label-update" for="">Name Course</label>
                <input oninput="checkInput()" class="test" type="text" name="newname">
                <span class ="form-message"></span>
            </div>
            <div class="input-group">
                <label class="label-update" for="">Decription</label>
                <input oninput="checkInput()" class="test" type="text" name="newdescription">
                <span class ="form-message"></span>
            </div>
            
            <button id="Update" onclick="fixCourse()">Update</button>
            <button onclick=" document.querySelector('.modifier-input-${item.id}').style.display = 'none'" style="cursor: pointer;" id="exit">Thoát</button>
        </div>
    </div>
        `
    })
    htmls.join('')
    console.log(htmls)
    root.innerHTML = htmls
} 

// hàm tạo Course
function create (data,callback) {
   // cấu hình lại phương thức của fetch
    var ability = {
        method: 'POST',
        body: JSON.stringify(data),// dùng để chuyển đổi nội dung gửi từ js -> json
        headers: {
            'Content-Type': 'application/json' // khai báo để biết nhận dữ liệu qua đâu 
            // 'Content-Type': 'application/x-www-form-urlencoded',
        }
    } 
    
    fetch(api,ability)
    .then(function(respone) {
        respone.json() // trả về 1 mảng (nội dung) mà mình vừa tạo ra
    })
    .then(callback)
}

// Hàm xóa course
function deleteCourse(id) {
    // cấu hình lại phương thức của fetch
    var ability = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json' // khai báo để biết nhận dữ liệu qua đâu 
            // 'Content-Type': 'application/x-www-form-urlencoded',
        }
    } 
    fetch(api + '/' + id, ability)
        .then (respone => respone.json())
        .then(function() {
            var dieukien= document.querySelector('#item-'+id) // chọc vào nút xóa qua id
            if (dieukien) { // kiểm tra xem đúng id chưa
                dieukien.remove()
            }
        })
}

//Hàm chỉnh sửa khía học
function putCourse (data,id) {
    var ability = {
        method: 'PUT',
        body: JSON.stringify(data),// dùng để chuyển đổi nội dung gửi từ js -> json (chỉ khi gởi dữ liệu qua lại mới cần dòng này)
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        }
    } 
    fetch(api +'/'+ id,ability)
        .then(function(respone) {
            return respone.json()
    })
    .then(
        App
    )
}

// Hàm bắt sự kiện chỉnh sửa
function fixCourse () {
    let dataName = document.querySelector('input[name="newname"]').value
    let dataDescription = document.querySelector('input[name="newdescription"]').value
    let inputs = document.querySelectorAll('.label-update')
    let data = { // dòng này dùng để tạo ra 1 biến để lưu lại các nội dung mà mình đã get từ doom
        name : dataName,
        description: dataDescription
    }
    let inputGroupParent = document.querySelector ('#Update').parentElement
    let id = inputGroupParent.id
    if (data.name && data.description) {
        putCourse(data,id)
    } else {
        let mess = document.querySelectorAll('.form-message')
        mess.forEach(item => {
            let value = item.parentElement.querySelector('.test').value
            if (value == "") {
                item.parentElement.querySelector('.form-message').innerText = "Xin mời nhập lại vào ô trống"
                item.parentElement.querySelector('.label-update').classList.add('invalid')
                item.parentElement.querySelector('input').style.border="solid 1px red"
            }
        })
    }
}

function checkInput() {
    let formMessage = document.querySelectorAll('.form-message')
    formMessage.forEach(item => {
        let input = item.parentElement.querySelector('.test')
        let data = input.value
        if (data) {
            item.parentElement.querySelector('.form-message').innerText = ""
            item.parentElement.querySelector('.label-update').classList.remove('invalid')
            item.parentElement.querySelector('input').style.borderColor="#4aa157"
        }
    })
}

function checkInput2() {
    let formMessage = document.querySelectorAll('.form-message-dk')
    formMessage.forEach(item => {
        let input = item.parentElement.querySelector('.input-modifier')
        console.log(formMessage.length)
        let data = input.value
        if (data) {
            item.parentElement.querySelector('.form-message-dk').innerText = ""
            item.parentElement.querySelector('.label').classList.remove('invalid')
            item.parentElement.querySelector('input').style.borderColor="#4aa157"
        }
    })
}