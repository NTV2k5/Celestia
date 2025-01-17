use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{console, Request, RequestInit, RequestMode, Response};

#[wasm_bindgen(start)]
pub fn run() {
    console::log_1(&"Hello from Rust!".into());
}

#[wasm_bindgen]
pub async fn check_certificate(certificate: &str) -> bool {
    console::log_1(&"Checking certificate...".into());

    // Tạo yêu cầu HTTP để kiểm tra chứng chỉ
    let url = format!("https://example.com/check_certificate?cert={}", certificate);
    let request = match Request::new_with_str(&url) {
        Ok(req) => req,
        Err(_) => {
            console::log_1(&"Failed to create request!".into());
            return false;
        }
    };

    let mut opts = RequestInit::new();
    opts.method("GET");
    opts.mode(RequestMode::Cors);

    let window = web_sys::window().expect("No global `window` exists!");
    let fetch_promise = window.fetch_with_request(&request);

    let response_value = match JsFuture::from(fetch_promise).await {
        Ok(res) => res,
        Err(_) => {
            console::log_1(&"Failed to fetch response!".into());
            return false;
        }
    };

    let response: Response = response_value.dyn_into().unwrap();
    if !response.ok() {
        console::log_1(&"HTTP request failed!".into());
        return false;
    }

    // Đọc dữ liệu JSON từ phản hồi
    let json_promise = response.json().unwrap();
    let json_value = match JsFuture::from(json_promise).await {
        Ok(value) => value,
        Err(_) => {
            console::log_1(&"Failed to parse JSON!".into());
            return false;
        }
    };

    // Kiểm tra kết quả từ phản hồi JSON
    let is_valid: bool = json_value.as_bool().unwrap_or(false);
    is_valid
}

