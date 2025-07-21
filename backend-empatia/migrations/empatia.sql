--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.0

-- Started on 2025-07-21 08:35:48

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3393 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 852 (class 1247 OID 16396)
-- Name: estado_tarea; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.estado_tarea AS ENUM (
    'pendiente',
    'completada'
);


ALTER TYPE public.estado_tarea OWNER TO postgres;

--
-- TOC entry 849 (class 1247 OID 16390)
-- Name: rol_usuario; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.rol_usuario AS ENUM (
    'lider',
    'miembro'
);


ALTER TYPE public.rol_usuario OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16411)
-- Name: tareas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tareas (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    asignado_a integer NOT NULL,
    mensaje text NOT NULL,
    mensaje_cordial text,
    respuesta text,
    respuesta_cordial text,
    estado public.estado_tarea DEFAULT 'pendiente'::public.estado_tarea NOT NULL,
    creado_por integer NOT NULL,
    creado_en timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    mensaje_original text,
    tipo_mensaje_seleccionado character varying(20) DEFAULT 'cordial'::character varying,
    respuesta_original text,
    tipo_respuesta_seleccionada character varying(20) DEFAULT 'cordial'::character varying
);


ALTER TABLE public.tareas OWNER TO postgres;

--
-- TOC entry 3394 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN tareas.mensaje_original; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tareas.mensaje_original IS 'Mensaje original antes de ser procesado por IA';


--
-- TOC entry 3395 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN tareas.tipo_mensaje_seleccionado; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tareas.tipo_mensaje_seleccionado IS 'Tipo de mensaje seleccionado: original o cordial';


--
-- TOC entry 3396 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN tareas.respuesta_original; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tareas.respuesta_original IS 'Respuesta original antes de ser procesada por IA';


--
-- TOC entry 3397 (class 0 OID 0)
-- Dependencies: 220
-- Name: COLUMN tareas.tipo_respuesta_seleccionada; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tareas.tipo_respuesta_seleccionada IS 'Tipo de respuesta seleccionada: original o cordial';


--
-- TOC entry 219 (class 1259 OID 16410)
-- Name: tareas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tareas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tareas_id_seq OWNER TO postgres;

--
-- TOC entry 3398 (class 0 OID 0)
-- Dependencies: 219
-- Name: tareas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tareas_id_seq OWNED BY public.tareas.id;


--
-- TOC entry 218 (class 1259 OID 16402)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    nombre_usuario character varying(50) NOT NULL,
    contrasena character varying(255) NOT NULL,
    rol public.rol_usuario NOT NULL
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16401)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 3222 (class 2604 OID 16414)
-- Name: tareas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas ALTER COLUMN id SET DEFAULT nextval('public.tareas_id_seq'::regclass);


--
-- TOC entry 3221 (class 2604 OID 16405)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 3387 (class 0 OID 16411)
-- Dependencies: 220
-- Data for Name: tareas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tareas (id, nombre, asignado_a, mensaje, mensaje_cordial, respuesta, respuesta_cordial, estado, creado_por, creado_en, mensaje_original, tipo_mensaje_seleccionado, respuesta_original, tipo_respuesta_seleccionada) FROM stdin;
23	Aplicaciones Distribuidas	9	Te encargo que completes la tarea lo antes posible, por favor	Te encargo que completes la tarea de manera eficiente y lo antes posible, por favor.	Claro, estaré encantado de completar la tarea de manera eficiente y lo antes posible. Gracias por confiar en mí.	Claro, estaré encantado de completar la tarea de manera eficiente y lo antes posible. Gracias por confiar en mí.	completada	8	2025-07-21 00:18:07.768276+00	Te encargo que completes la tarea lo antes posible, por favor	original	Claro, estaré encantado de completar la tarea de manera eficiente y lo antes posible. Gracias por confiar en mí.	original
24	Aplicaciones Distribuidas	12	Te encargo que lo realices con esmero y atención al detalle para asegurar un buen resultado	Te encargo que lo realices con esmero y atención al detalle para asegurar un buen resultado	\N	\N	pendiente	8	2025-07-21 00:33:22.204938+00	Si, tienes que hacerlo bien	cordial	\N	cordial
25	David	12	Por favor, te encargo que...	Por favor, te encargo que...	Me alegra que me hayas encargado	Me alegra que me hayas encargado	completada	8	2025-07-21 00:35:23.5249+00	Te lo encargo	cordial	Si que me quiere encargar	cordial
\.


--
-- TOC entry 3385 (class 0 OID 16402)
-- Dependencies: 218
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, nombre_usuario, contrasena, rol) FROM stdin;
8	admin	$2b$10$Zpv143o9SYq5tiy78wmYgeEN9SuxnQIW82wyo1OBQd7Ey.mEC5Oae	lider
9	david	$2b$10$WVXSYo3suluAH2IC6zWzJuEwArQm6JdAZ8LlS7qBO3VObhwQBsZGK	miembro
10	mateo	$2b$10$bkY/uETxlJbLHXWAASJ1DORuaVGs54.gE1JIPIuDzRnnAaxPLJ25u	miembro
11	camila	$2b$10$jQ5SleSo47VF0w6tv0Dbn.6FNviLxYy1Jc.qqQa7cwllFW6g6Onum	miembro
12	sebastian	$2b$10$IXf.pZq7psMcTmuQ8pSp/uFu563m6R3Yr3.YOhldfkKuCxhhWWs.C	miembro
\.


--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 219
-- Name: tareas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tareas_id_seq', 25, true);


--
-- TOC entry 3401 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 12, true);


--
-- TOC entry 3236 (class 2606 OID 16420)
-- Name: tareas tareas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_pkey PRIMARY KEY (id);


--
-- TOC entry 3228 (class 2606 OID 16409)
-- Name: usuarios usuarios_nombre_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_nombre_usuario_key UNIQUE (nombre_usuario);


--
-- TOC entry 3230 (class 2606 OID 16407)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 3231 (class 1259 OID 16431)
-- Name: idx_tareas_asignado_a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tareas_asignado_a ON public.tareas USING btree (asignado_a);


--
-- TOC entry 3232 (class 1259 OID 16434)
-- Name: idx_tareas_creado_en; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tareas_creado_en ON public.tareas USING btree (creado_en);


--
-- TOC entry 3233 (class 1259 OID 16432)
-- Name: idx_tareas_creado_por; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tareas_creado_por ON public.tareas USING btree (creado_por);


--
-- TOC entry 3234 (class 1259 OID 16433)
-- Name: idx_tareas_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tareas_estado ON public.tareas USING btree (estado);


--
-- TOC entry 3237 (class 2606 OID 16421)
-- Name: tareas tareas_asignado_a_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_asignado_a_fkey FOREIGN KEY (asignado_a) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


--
-- TOC entry 3238 (class 2606 OID 16426)
-- Name: tareas tareas_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tareas
    ADD CONSTRAINT tareas_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuarios(id) ON DELETE RESTRICT;


-- Completed on 2025-07-21 08:35:48

--
-- PostgreSQL database dump complete
--

