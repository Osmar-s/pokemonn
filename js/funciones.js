'use strict';

const d = document, $btnAbrirBuscador = d.getElementById("btnAbrirBuscador"),
$btnRegresarPrincipal = d.getElementById("btnRegresar"),
$contBuscador = d.getElementById("contBuscador"),
$inputBuscador = d.getElementById("inputBuscador"),
nombres = [],
$contenedorResultados = d.getElementById('resultados'),
$contCargando = d.getElementById("cargando"),
$contenedorPokemon = d.getElementById("contenedorPokemon");

//FUNCIONES

const TraerNombres = async () => {
    const Conexion = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1118&offset=0');
    const Respuesta = await Conexion.json();
    Respuesta.results.forEach((elemento) => nombres.push(elemento.name));
}

const MostrarResultados = (resultados) => {
    const $fragmento = d.createDocumentFragment();
    resultados.forEach((elemento) => {
        const $p = d.createElement("p");
        $p.textContent = elemento;
        $fragmento.appendChild($p);
    });
    $contenedorResultados.replaceChildren($fragmento);
}

const BuscarResultados = (textoInput) => {
    const PosiblesResultados = [];
    if(textoInput !== ''){
        nombres.forEach((elemento) => {
            if(elemento.startsWith(textoInput)) PosiblesResultados.push(elemento);
        });
    }
    MostrarResultados(PosiblesResultados);
}

const CambiarNombre = (tipo) => {
    let a = "";
    switch(tipo){
        case 'normal':
            a = 'normal';
            break;
        case 'fighting':
            a = 'lucha';
            break;
        case 'flying':
            a = 'volador';
            break;
        case 'poison':
            a = 'veneno';
            break;
        case 'ground':
            a = 'tierra';
            break;
        case 'rock':
            a = 'roca';
            break;
        case 'bug':
            a = 'animal';
            break;
        case 'ghost':
            a = 'fantasma';
            break;
        case 'steel':
            a = 'acero';
            break;
        case 'fire':
            a = 'fuego';
            break;
        case 'water':
            a = 'agua';
            break;
        case 'grass':
            a = 'planta';
            break;
        case 'electric':
            a = 'electrico';
            break;
        case 'psychic':
            a = 'psiquico';
            break;
        case 'ice':
            a = 'hielo';
            break;
        case 'dragon':
            a = 'dragon';
            break;
        case 'dark':
            a = 'siniestro';
            break;
        case 'fairy':
            a = 'hada';
            break;
        case 'unknow':
            a = 'Desconocido';
            break;
        case 'shadow':
            a = 'sombra';
            break;
    }
    return a;
}

const TarjetaPokemon = ({nombre,imagen,descripcion,tipos}) =>{
    const $tarjeta = d.createElement("div");
    const $pTitulo = d.createElement("p");
    const $pDescripcion = d.createElement("p");
    const $imagen = d.createElement("img");
    const $div = d.createElement("div");
    $div.setAttribute("class","contTipos");
    tipos.forEach((elemento) => {
        const $tar = d.createElement("div");
        let a = CambiarNombre(elemento.type.name);
        $tar.textContent = a;
        $tar.setAttribute("class",`${a} sk`);
        $div.appendChild($tar);
    });
    $pTitulo.textContent = nombre;
    $pDescripcion.textContent = descripcion;
    $imagen.setAttribute("src",imagen);
    $imagen.setAttribute("alt",nombre);
    $pTitulo.setAttribute("class","pTitulo");
    $pDescripcion.setAttribute("class","pDescripcion");
    $tarjeta.appendChild($imagen);
    $tarjeta.appendChild($pTitulo);
    $tarjeta.appendChild($pDescripcion);
    $tarjeta.appendChild($div);
    $contenedorPokemon.replaceChildren($tarjeta);
}

const BuscarPokemon = async (nombrePokemon) => {
    $contCargando.classList.remove("esconder");
    const Conexion = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombrePokemon}`);
    const Respuesta = await Conexion.json();
    console.log(Respuesta);
    const ObtenerInfo = await fetch(Respuesta.species.url);
    const Res = await ObtenerInfo.json();
    let descripcion;
    Res.flavor_text_entries.forEach((elemento) => {
        if(elemento.language.name === "es"){
            descripcion =  elemento.flavor_text;
            return;
        }
    });
    TarjetaPokemon({
        nombre:Respuesta.name,
        imagen:(Respuesta.sprites.other.dream_world.front_default !== null) ? Respuesta.sprites.other.dream_world.front_default : (Respuesta.sprites.other['official-artwork'].front_default !== null) ? Respuesta.sprites.other['official-artwork'].front_default : Respuesta.sprites.front_default,
        descripcion:descripcion,
        tipos:Respuesta.types
    });
    $inputBuscador.value = "";
    $contenedorResultados.replaceChildren();
    $contBuscador.classList.add("esconder");
    $contCargando.classList.add("esconder");
}

//EVENTOS

$btnAbrirBuscador.addEventListener("click",() => $contBuscador.classList.remove('esconder'));

$btnRegresarPrincipal.addEventListener("click",() => $contBuscador.classList.add("esconder"));

$inputBuscador.addEventListener("keyup",() => BuscarResultados($inputBuscador.value));

d.addEventListener("click",(e) => {
    if(e.target.matches('.resultados p')) BuscarPokemon(e.target.textContent);
});

TraerNombres();