// TODO: collect users' data and send to the server
document.addEventListener("DOMContentLoaded", function () {
  const openBtn = document.getElementById("openFormBtn")
  const modal = document.getElementById("guestFormModal")
  const closeBtn = document.getElementById("closeModal")

  openBtn.addEventListener("click", function() { modal.style.display = "block" })
  closeBtn.addEventListener("click", function() { modal.style.display = "none" })
  window.addEventListener("click", function(e) { if(e.target === modal) modal.style.display = "none" })

  //submit event to collect users' data
  const guestForm = document.getElementById("guestForm")
  guestForm.addEventListener("submit", async function(e) {
    e.preventDefault()

    //fetch the POST server route
    const formData = {
      photo_url: document.getElementById("photo").value,
      name: document.getElementById("name").value,
      message: document.getElementById("message").value,
      socials: document.getElementById("socials").value
    }

    try {
      // fetch("url", { method:, headers:{}, body:JSON.stringify() })
      const response = await fetch("http://localhost:8080/new-guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formValues: formData })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || "Failed to add entry")

      const container = document.querySelector(".guestbkContainer")
      const div = document.createElement("div")
      div.className = "entry"
      div.innerHTML = `
        <img src="${formData.photo_url}" alt="${formData.name}'s photo">
        <p>${formData.name}</p>
        <p>${formData.message}</p>
        <p>${formData.socials}</p>
      `
      container.insertBefore(div, container.children[1])
      guestForm.reset()
      modal.style.display = "none"
    } catch(err) {
      console.error(err)
      alert("Error adding entry")
    }
  })

  // TODO: render users' data on the interface
  async function loadGuestbook() {
    try {
      //fetch the GET route from the server
      const response = await fetch("http://localhost:8080/guests")
      const entries = await response.json()
      const container = document.querySelector(".guestbkContainer")
      // render the data using DOM elements (one per piece of data)
      entries.forEach(entry => {
        const div = document.createElement("div")
        div.className = "entry"
        div.innerHTML = `
          <img src="${entry.photo_url}" alt="${entry.name}'s photo">
          <p>${entry.name}</p>
          <p>${entry.message}</p>
          <p>${entry.socials}</p>
        `
        container.appendChild(div)
      })
    } catch(err) {
      console.error("Failed to load guestbook entries:", err)
    }
  }

  loadGuestbook()
})
