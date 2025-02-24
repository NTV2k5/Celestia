use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use serde::{Deserialize, Serialize};
use reqwest;

// Celestia API Endpoints
const CELESTIA_BASE_URL: &str = "http://localhost:26659";

// Request struct for verifying certificates
#[derive(Deserialize)]
struct CertificateRequest {
    domain: String,
}

// Response struct for certificate validation
#[derive(Serialize)]
struct CertificateResponse {
    domain: String,
    valid: bool,
    message: String,
}

// Fetch the latest Merkle Root from Celestia
async fn get_merkle_root() -> HttpResponse {
    let url = format!("{}/namespaced_shares/namespace_id/height/12345", CELESTIA_BASE_URL);

    match reqwest::get(&url).await {
        Ok(response) => {
            let data = response.text().await.unwrap_or_else(|_| "Error fetching Merkle Root".to_string());
            HttpResponse::Ok().body(data)
        }
        Err(_) => HttpResponse::InternalServerError().body("Failed to fetch Merkle Root"),
    }
}

// Verify a certificate
async fn verify_certificate(cert: web::Json<CertificateRequest>) -> impl Responder {
    let dummy_valid = true; // Simulate validation for now

    HttpResponse::Ok().json(CertificateResponse {
        domain: cert.domain.clone(),
        valid: dummy_valid,
        message: if dummy_valid {
            "Certificate is valid"
        } else {
            "Certificate is invalid"
        }
        .to_string(),
    })
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .route("/get_merkle_root", web::get().to(get_merkle_root))
            .route("/verify_certificate", web::post().to(verify_certificate))
    })
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
