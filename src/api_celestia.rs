// Fetch Blob from Celestia
async fn fetch_blob(namespace_id: &str, height: u64) -> Result<String, reqwest::Error> {
    let url = format!("{}/blob/namespaced_shares/{}/height/{}", CELESTIA_BASE_URL, namespace_id, height);
    let response = reqwest::get(&url).await?;
    response.text().await
}

// Fetch Header from Celestia
async fn fetch_header(height: u64) -> Result<String, reqwest::Error> {
    let url = format!("{}/header/height/{}", CELESTIA_BASE_URL, height);
    let response = reqwest::get(&url).await?;
    response.text().await
}

// Fetch State from Celestia
async fn fetch_state(key: &str) -> Result<String, reqwest::Error> {
    let url = format!("{}/state/{}", CELESTIA_BASE_URL, key);
    let response = reqwest::get(&url).await?;
    response.text().await
}
