// ---------- Endpoints ----------

//  Endpoints de apis externas
const pokeURL = "https://pokeapi.co/api/v2/pokemon/"
const userURL = "https://api.dicebear.com/9.x/adventurer/svg?seed="

// Endpoints de su API
const personaUnicaURL = "http://localhost:8000/api/persona/" // Aqui debe traer solo una persona (ojala de manera aleatoria)
const personasURL = "http://localhost:8000/api/personas/" // En este debe traer a todas las personas pero necesita de un token JWT
const jwt = "http://localhost:8000/api/token/" // Endpoint para obtener el token jwt


// ---------- Constantes ----------

// Etiquetas HTML
const pokeList = document.querySelector("#pokeList")
const nombrePersona = document.querySelector('#nombre')
const personaImg = document.querySelector('#imgPersona')
const form = document.querySelector('#tokenForm')


// Cantidad pokemones
const cantidad = 6


// ---------- Utilidades ----------

function getNumeroRandom(){
    const min = 1
    const max = 1000
    return Math.floor(Math.random() * (max-min + 1) )+min
}

/**
 * Agrega un pokemon a la lista pokelist del HTML
 * @param {json} pokemon 
 */
function agregarPokemon(pokemon){

    // Creación de nuevas etiquetas
    let newDiv = document.createElement('div')
    let pokeImage = document.createElement('img')
    let cardBody = document.createElement('div')
    let pokeName = document.createElement('h4')

    // Inserción de los datos
    newDiv.className = "card container align-self-center d-flex flex-column align-items-center m-1"
    newDiv.style = "width: 32.33333%;display:none; border:1px solid black;"
    cardBody.className = "card-body"

    pokeImage.src = pokemon.imagen
    pokeImage.className = "card-img-top"
    pokeName.textContent = pokemon.nombre
    

    // Inserción de las etiquetas
    newDiv.appendChild(pokeName)
    newDiv.appendChild(pokeImage)
    //newDiv.appendChild(cardBody)
    pokeList.appendChild(newDiv)
}

// ---------- Consumo de API local ----------


/**
 * Obtiene el Token JWT y lo guarda automaticamente en el Local Storage
 */
async function getJWT(username,pwd){
    const response = await fetch(jwt, {
        method : 'POST',
        headers :{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({
            'username':username,
            'password':pwd
        })
    })
    
    if (!response.ok) {
        console.log("Error al traer el token",response.status)
        if (response.status == 401){
            window.alert("Credenciales invalidas")
        }
        throw new Error("Error al traer el token",response.status)
    }
    const data = await response.json()

    if (!data.access) {
        throw new Error("Respuesta inválida: no viene 'access'")
    }
    return data

}

/**
* Hace una consulta a la API creada por ustedes para traer solo una persona
* **No necesita de un token para traer el dato**
* @returns {string}
*/
async function getNombrePersonaRandom(){
    try{
        const response = await fetch(personaUnicaURL)
        const persona = await response.json()
        const nombre = persona.nombre + " " + persona.apellido
        return nombre
    }
    catch(error){
        console.log(error.message)
    }
}

/**
 * Obtiene todas las personas de la Base de Datos
 * **Necesita de un token para poder funcionar**
 */
async function getPersonas() {
    try{
        const token = localStorage.getItem('jwtToken')
        if (token == null){
            window.alert("Necesita de un token primero")
            return
        }

        const response = await fetch(personasURL,{
            method : 'GET',
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        
        const data = await response.json()
        const area = document.querySelector("#respuesta")
        area.textContent = ""
        area.textContent = JSON.stringify(data,null,2)
    }
    catch(error){
        console.log(error)
        throw new Error(`Error al obtener todas las personas ${error}`)
    }
}


// ---------- Consumo de API's externas ----------

/**
 * Hace una consulta a la api de pokemon "pokeAPI"
 * Trae un json de un Pokemon que contiene noombre e imagen
 * @returns {json}
 */
async function getPokemonRandom(){
    try{
        const url = pokeURL + getNumeroRandom().toString()
        const response = await fetch(url)
        const datos = await response.json()
        const pokemon = {
            "nombre" : datos.name,
            "imagen" : datos.sprites.front_default
        }

        return pokemon
    }
    catch(error){
        console.log(error)
        throw new Error(`Error al traer un pokemon ${error}`)
    }
}


/**
 * Hace una consulta al api de usuarios random
 * Trae una imagen aleatoria de un usuario
 * @returns {string} urlImagen
 */
async function getImagenPersonaRandom(){
    try{
        const url = userURL + getNumeroRandom().toString()
        return url
        //return datos.results[0].picture.large
    }
    catch(error){
        console.log(error)
        throw new Error(`Error al traer una imagen de usuario ${error}`)
    }
}

// ---------- Funcionalidad de la página ----------

/**
 * Hace consultas a la API local para traer un nombre
 * Lo aleatorio está presente dentro del backend
 * Dicho nombre lo actualiza en el html directamente
 */
async function cambiarNombrePersonaRandom(){
    try{
        nombrePersona.textContent = await getNombrePersonaRandom()
    }
    catch(error){
        console.log(error)
        throw new Error(`Error al traer una persona random ${error} `)
    }
}

/**
 * Hace consultas a la pokeAPI dependiendo de la cantidad dada
 * Modifica la lista de pokemones en el html con un nuevo equipo
 */
async function cambiarEquipoPokemon(){
    // Reniciamos la lista
    pokeList.innerHTML = ""

    try{
        for(let i = 0; i<cantidad;i++){
            let pokemon = await getPokemonRandom()
            agregarPokemon(pokemon)
        }
    }catch(error){
        console.log(error)
        throw new Error(`Error al cambiar el equipo pokemon ${error} `)
    }
}

/**
 * Hace una consulta a la API de usuarios random y trae la imagen
 * Dicha imagen es puesta en el HTML correspondiente
 */
async function cambiarImagenPersona(){
    try{
        personaImg.src = await getImagenPersonaRandom()
    }
    catch(error){
        console.log(error)
        throw new Error(`Error al cambiar la imagen de la persona ${error} `)
    }
}



/**
 * Maneja el formulario para consultar el token
 * En caso de estar todo ok, guarda el token en localStorage
 */
form.addEventListener('submit', async function(event){
    event.preventDefault()
    const username = document.querySelector("#username").value
    const pwd = document.querySelector("#password_field").value
    try{
        
        const token = await getJWT(username,pwd)
        localStorage.setItem('jwtToken',token.access) 
        window.alert("Token obtenido y guardado!")


    }
    catch (error){
        console.log(error)
        throw new Error(`Error al obtener el token ${error}`)
    }

} )

