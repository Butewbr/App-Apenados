--
-- PostgreSQL database dump
--

-- Dumped from database version 14.4
-- Dumped by pg_dump version 14.4

-- Started on 2024-06-28 13:23:19

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 220 (class 1255 OID 309510)
-- Name: altera_data_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.altera_data_at() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog', 'public'
    AS $$
BEGIN
	IF (TG_OP = 'UPDATE' AND TG_LEVEL = 'ROW') THEN
		NEW.data_at = CURRENT_TIMESTAMP; 
	END IF;
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.altera_data_at() OWNER TO postgres;

--
-- TOC entry 224 (class 1255 OID 309511)
-- Name: seq_chave_composta_end(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.seq_chave_composta_end() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog', 'public'
    AS $$
DECLARE
	id_index_atual bigint;
	val_index_atual bigint;
	total bigint;
BEGIN
	IF (TG_OP = 'INSERT' AND TG_LEVEL = 'ROW') THEN
		SELECT COUNT(id) INTO total FROM public."IndexEndereco" WHERE id_pessoa=NEW.id_pessoa;
		IF (total = 0) THEN
			INSERT INTO public."IndexEndereco" (id_pessoa,index_atual) VALUES (NEW.id_pessoa,1);
		END IF;
		IF (NEW.id = 0 OR NEW.id = NULL) THEN
			SELECT id,index_atual INTO id_index_atual,val_index_atual FROM public."IndexEndereco" WHERE id_pessoa=NEW.id_pessoa; 
			NEW.id = val_index_atual;
			UPDATE public."IndexEndereco"
			SET index_atual=(val_index_atual+1)
			WHERE id=id_index_atual;
		END IF;
	END IF;
	RETURN NEW;
END;
$$;


ALTER FUNCTION public.seq_chave_composta_end() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 318062)
-- Name: altpenal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.altpenal (
    id integer NOT NULL,
    data_ins timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_apenado bigint NOT NULL,
    id_endereco bigint,
    vara integer,
    num_autos character varying(250),
    data_inicio date,
    data_fim date,
    medida_imposta character varying(250),
    situacao boolean DEFAULT true NOT NULL
);


ALTER TABLE public.altpenal OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 318061)
-- Name: altpenal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.altpenal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.altpenal_id_seq OWNER TO postgres;

--
-- TOC entry 3376 (class 0 OID 0)
-- Dependencies: 218
-- Name: altpenal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.altpenal_id_seq OWNED BY public.altpenal.id;


--
-- TOC entry 215 (class 1259 OID 309772)
-- Name: apenado; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.apenado (
    id integer NOT NULL,
    cpf character varying(11),
    relevancia integer,
    nome character varying,
    telefone character varying(20)
);


ALTER TABLE public.apenado OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 309771)
-- Name: apenado_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.apenado_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.apenado_id_seq OWNER TO postgres;

--
-- TOC entry 3377 (class 0 OID 0)
-- Dependencies: 214
-- Name: apenado_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.apenado_id_seq OWNED BY public.apenado.id;


--
-- TOC entry 213 (class 1259 OID 309758)
-- Name: crime; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.crime (
    id integer NOT NULL,
    data_ocorrido date,
    descricao character varying(1000),
    id_altpenal integer
);


ALTER TABLE public.crime OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 309757)
-- Name: crime_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.crime_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.crime_id_seq OWNER TO postgres;

--
-- TOC entry 3378 (class 0 OID 0)
-- Dependencies: 212
-- Name: crime_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.crime_id_seq OWNED BY public.crime.id;


--
-- TOC entry 211 (class 1259 OID 309740)
-- Name: endereco; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.endereco (
    id integer NOT NULL,
    rua character varying(250),
    numero integer,
    complemento character varying(250),
    cep integer,
    estado character varying(250),
    municipio character varying(250),
    info_geo jsonb,
    id_apenado bigint
);


ALTER TABLE public.endereco OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 309739)
-- Name: endereco_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.endereco_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.endereco_id_seq OWNER TO postgres;

--
-- TOC entry 3379 (class 0 OID 0)
-- Dependencies: 210
-- Name: endereco_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.endereco_id_seq OWNED BY public.endereco.id;


--
-- TOC entry 209 (class 1259 OID 309686)
-- Name: usuario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuario (
    matricula character varying(50) NOT NULL,
    cpf_pessoa character varying(11),
    password_hash character varying(100) NOT NULL,
    nome character varying
);


ALTER TABLE public.usuario OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 309796)
-- Name: visita; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visita (
    id integer NOT NULL,
    observacao character varying(1000) NOT NULL,
    id_endereco integer,
    matricula_usuario character varying(50),
    id_apenado integer,
    data_visita date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    estava_em_casa boolean DEFAULT true NOT NULL,
    id_altpenal bigint NOT NULL
);


ALTER TABLE public.visita OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 309795)
-- Name: visita_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.visita_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.visita_id_seq OWNER TO postgres;

--
-- TOC entry 3380 (class 0 OID 0)
-- Dependencies: 216
-- Name: visita_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.visita_id_seq OWNED BY public.visita.id;


--
-- TOC entry 3196 (class 2604 OID 318065)
-- Name: altpenal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.altpenal ALTER COLUMN id SET DEFAULT nextval('public.altpenal_id_seq'::regclass);


--
-- TOC entry 3192 (class 2604 OID 309775)
-- Name: apenado id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apenado ALTER COLUMN id SET DEFAULT nextval('public.apenado_id_seq'::regclass);


--
-- TOC entry 3191 (class 2604 OID 309761)
-- Name: crime id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crime ALTER COLUMN id SET DEFAULT nextval('public.crime_id_seq'::regclass);


--
-- TOC entry 3190 (class 2604 OID 309743)
-- Name: endereco id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endereco ALTER COLUMN id SET DEFAULT nextval('public.endereco_id_seq'::regclass);


--
-- TOC entry 3193 (class 2604 OID 309799)
-- Name: visita id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visita ALTER COLUMN id SET DEFAULT nextval('public.visita_id_seq'::regclass);


--
-- TOC entry 3370 (class 0 OID 318062)
-- Dependencies: 219
-- Data for Name: altpenal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.altpenal (id, data_ins, data_at, id_apenado, id_endereco, vara, num_autos, data_inicio, data_fim, medida_imposta, situacao) FROM stdin;
4	2024-05-22 19:18:16.723882	2024-05-22 19:18:16.723882	2	3	2	6789	2022-01-01	2024-12-31	medida imposta 2	t
7	2024-06-28 01:47:45.266523	2024-06-28 01:47:45.266523	1	2	1	432432	2022-01-01	2024-12-31	medida imposta 0	t
2	2024-05-22 19:18:16.723882	2024-05-24 14:48:22.425028	5	1	1	12345	2022-01-23	2024-12-31	medida imposta	t
10	2024-06-28 11:15:18.137814	2024-06-28 11:15:18.137814	11	8	1	321312	2024-06-23	2024-07-06	ddasdsa	t
5	2024-05-22 19:18:16.723882	2024-05-22 19:18:16.723882	6	4	3	ABCD	2022-01-01	2024-12-31	medida imposta 3	t
\.


--
-- TOC entry 3366 (class 0 OID 309772)
-- Dependencies: 215
-- Data for Name: apenado; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.apenado (id, cpf, relevancia, nome, telefone) FROM stdin;
1	765765757	1	Bernardo	\N
2	44841720	3	Luís André da Rosa de Lima	\N
5	312321321	5	alison	\N
11	12321321	2	Tstasd	321321
6	75678678	2	ndsajkkn	\N
\.


--
-- TOC entry 3364 (class 0 OID 309758)
-- Dependencies: 213
-- Data for Name: crime; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.crime (id, data_ocorrido, descricao, id_altpenal) FROM stdin;
1	2024-06-06	1221	10
\.


--
-- TOC entry 3362 (class 0 OID 309740)
-- Dependencies: 211
-- Data for Name: endereco; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.endereco (id, rua, numero, complemento, cep, estado, municipio, info_geo, id_apenado) FROM stdin;
3	R. Flores de Laranjeira	54	\N	88906000	SC	Araranguá	{"coordinates": [-49.470738, -28.945093]}	5
2	R. dos Cravos	274	\N	88900043	SC	Araranguá	{"coordinates": [-49.467665, -28.945814]}	1
1	 R. Caetano Lummertz	456	\N	88900043	SC	Araranguá	{"coordinates": [-49.48226570746353, -28.933063538181845]}	2
8	ufsc campus ararangua	\N		\N			{"coordinates": ["-49.467542271391395", "-28.9512064"]}	\N
4	hospital regional	\N	\N	\N	SC	Araranguá	{"coordinates": ["-49.4643657477005", "-28.940061649999997"]}	6
\.


--
-- TOC entry 3360 (class 0 OID 309686)
-- Dependencies: 209
-- Data for Name: usuario; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuario (matricula, cpf_pessoa, password_hash, nome) FROM stdin;
123456	23456785	$2b$12$uCypw8KJPQx1dfod5pC/suFYW.KIG52khsL86lkEynMUIKS3QSLXi	Bernardo
17204484	10414086929	$2b$12$N5m7rJ6RsYTPM/hEhwXdoeKhdAicMwRttJYBGSdBlBvbxuinYk0..	André Luís da Rosa de Lima
665656	765765757	$2b$12$RUrtiUldc7rgdJ3/rIDJMO.HTADEKjCogTHu5F5zg8QpU45lnIona	Fernando
5436346	645654564	$2b$12$N5m7rJ6RsYTPM/hEhwXdoeKhdAicMwRttJYBGSdBlBvbxuinYk0..	Alisson
pmsystem	464846984	$2b$12$HKAnohLKmaT.L2FBrVs/Rui5SdyncFOfbXdPA3eRNbygZ0KIhLv7W	pmsystem
\.


--
-- TOC entry 3368 (class 0 OID 309796)
-- Dependencies: 217
-- Data for Name: visita; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.visita (id, observacao, id_endereco, matricula_usuario, id_apenado, data_visita, estava_em_casa, id_altpenal) FROM stdin;
55	rrerewe	3	17204484	5	2024-06-28	t	4
56	nvbnbvbnv	4	17204484	6	2024-06-28	t	5
57	dsdfsfds	4	17204484	6	2024-06-28	t	5
58	asddsadsa	3	17204484	5	2024-06-28	f	4
59	fddfsfds	3	17204484	5	2024-06-28	t	4
60	dfsfdfds	3	17204484	5	2024-06-28	t	4
61	dfsfdsds	2	17204484	1	2024-06-28	t	7
62	asasddsasda	8	pmsystem	\N	2024-06-28	t	10
\.


--
-- TOC entry 3381 (class 0 OID 0)
-- Dependencies: 218
-- Name: altpenal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.altpenal_id_seq', 10, true);


--
-- TOC entry 3382 (class 0 OID 0)
-- Dependencies: 214
-- Name: apenado_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.apenado_id_seq', 11, true);


--
-- TOC entry 3383 (class 0 OID 0)
-- Dependencies: 212
-- Name: crime_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.crime_id_seq', 1, true);


--
-- TOC entry 3384 (class 0 OID 0)
-- Dependencies: 210
-- Name: endereco_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.endereco_id_seq', 8, true);


--
-- TOC entry 3385 (class 0 OID 0)
-- Dependencies: 216
-- Name: visita_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.visita_id_seq', 62, true);


--
-- TOC entry 3215 (class 2606 OID 318072)
-- Name: altpenal AltPenal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.altpenal
    ADD CONSTRAINT "AltPenal_pkey" PRIMARY KEY (id);


--
-- TOC entry 3209 (class 2606 OID 309779)
-- Name: apenado apenado_cpf_pessoa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apenado
    ADD CONSTRAINT apenado_cpf_pessoa_key UNIQUE (cpf);


--
-- TOC entry 3211 (class 2606 OID 309777)
-- Name: apenado apenado_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.apenado
    ADD CONSTRAINT apenado_pkey PRIMARY KEY (id);


--
-- TOC entry 3207 (class 2606 OID 309765)
-- Name: crime crime_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.crime
    ADD CONSTRAINT crime_pkey PRIMARY KEY (id);


--
-- TOC entry 3205 (class 2606 OID 309747)
-- Name: endereco endereco_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.endereco
    ADD CONSTRAINT endereco_pkey PRIMARY KEY (id);


--
-- TOC entry 3201 (class 2606 OID 309692)
-- Name: usuario policial_cpf_pessoa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT policial_cpf_pessoa_key UNIQUE (cpf_pessoa);


--
-- TOC entry 3203 (class 2606 OID 309690)
-- Name: usuario policial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT policial_pkey PRIMARY KEY (matricula);


--
-- TOC entry 3213 (class 2606 OID 309803)
-- Name: visita visita_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visita
    ADD CONSTRAINT visita_pkey PRIMARY KEY (id);


--
-- TOC entry 3220 (class 2606 OID 318078)
-- Name: altpenal id_apenado_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.altpenal
    ADD CONSTRAINT id_apenado_fk FOREIGN KEY (id_apenado) REFERENCES public.apenado(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 3219 (class 2606 OID 318073)
-- Name: altpenal id_endereco_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.altpenal
    ADD CONSTRAINT id_endereco_fk FOREIGN KEY (id_endereco) REFERENCES public.endereco(id);


--
-- TOC entry 3218 (class 2606 OID 309814)
-- Name: visita visita_id_apenado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visita
    ADD CONSTRAINT visita_id_apenado_fkey FOREIGN KEY (id_apenado) REFERENCES public.apenado(id);


--
-- TOC entry 3216 (class 2606 OID 309804)
-- Name: visita visita_id_endereco_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visita
    ADD CONSTRAINT visita_id_endereco_fkey FOREIGN KEY (id_endereco) REFERENCES public.endereco(id);


--
-- TOC entry 3217 (class 2606 OID 309809)
-- Name: visita visita_matricula_policial_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visita
    ADD CONSTRAINT visita_matricula_policial_fkey FOREIGN KEY (matricula_usuario) REFERENCES public.usuario(matricula);


-- Completed on 2024-06-28 13:23:19

--
-- PostgreSQL database dump complete
--

