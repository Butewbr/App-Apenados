--
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

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
-- Name: altera_data_at(); Type: FUNCTION; Schema: public
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


-- ALTER FUNCTION public.altera_data_at() OWNER TO "username";

--
-- Name: seq_chave_composta_end(); Type: FUNCTION; Schema: public
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


-- ALTER FUNCTION public.seq_chave_composta_end() OWNER TO "username";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Crime; Type: TABLE; Schema: public
--

CREATE TABLE public."Crime" (
    id bigint NOT NULL,
    data_ins timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    data_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_alt_penal bigint NOT NULL,
    id_tipo_crime bigint NOT NULL
);


-- ALTER TABLE public."Crime" OWNER TO "username";

--
-- Name: Crime_id_seq; Type: SEQUENCE; Schema: public
--

CREATE SEQUENCE public."Crime_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public."Crime_id_seq" OWNER TO "username";

--
-- Name: Crime_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE public."Crime_id_seq" OWNED BY public."Crime".id;


--
-- Name: Endereco; Type: TABLE; Schema: public
--

CREATE TABLE public."Endereco" (
    id bigint DEFAULT 0 NOT NULL,
    data_ins timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_pessoa bigint NOT NULL,
    info_geo jsonb,
    logradouro character varying(250),
    numero integer,
    complemento character varying(250),
    cep integer,
    estado character varying(250),
    municipio character varying(250)
);


-- ALTER TABLE public."Endereco" OWNER TO "username";

--
-- Name: IndexEndereco; Type: TABLE; Schema: public
--

CREATE TABLE public."IndexEndereco" (
    id bigint NOT NULL,
    data_ins timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_pessoa bigint NOT NULL,
    index_atual bigint DEFAULT 0 NOT NULL
);


-- ALTER TABLE public."IndexEndereco" OWNER TO "username";

--
-- Name: IndexEndereco_id_seq; Type: SEQUENCE; Schema: public
--

CREATE SEQUENCE public."IndexEndereco_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public."IndexEndereco_id_seq" OWNER TO "username";

--
-- Name: IndexEndereco_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE public."IndexEndereco_id_seq" OWNED BY public."IndexEndereco".id;


--
-- Name: AltPenal; Type: TABLE; Schema: public
--

CREATE TABLE public."AltPenal" (
    id bigint NOT NULL,
    data_ins timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_pessoa bigint NOT NULL,
    id_endereco bigint,
    vara integer,
    num_autos character varying(250),
    data_inicio date,
    data_fim date,
    medida_imposta character varying(250),
    situacao boolean DEFAULT true NOT NULL
);


-- ALTER TABLE public."AltPenal" OWNER TO "username";

--
-- Name: AltPenal_id_seq; Type: SEQUENCE; Schema: public
--

CREATE SEQUENCE public."AltPenal_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public."AltPenal_id_seq" OWNER TO "username";

--
-- Name: AltPenal_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE public."AltPenal_id_seq" OWNED BY public."AltPenal".id;


--
-- Name: Pessoa; Type: TABLE; Schema: public
--

CREATE TABLE public."Pessoa" (
    id bigint NOT NULL,
    data_ins timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cpf bigint,
    nome character varying(250),
    relevancia integer DEFAULT 0,
    tel_ddi numeric(3,0),
    tel_ddd integer,
    tel_num integer
);


-- ALTER TABLE public."Pessoa" OWNER TO "username";

--
-- Name: Pessoa_id_seq; Type: SEQUENCE; Schema: public
--

CREATE SEQUENCE public."Pessoa_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public."Pessoa_id_seq" OWNER TO "username";

--
-- Name: Pessoa_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE public."Pessoa_id_seq" OWNED BY public."Pessoa".id;


--
-- Name: TipoCrime; Type: TABLE; Schema: public;
--

CREATE TABLE public."TipoCrime" (
    id bigint NOT NULL,
    data_ins time without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_at time without time zone DEFAULT CURRENT_TIMESTAMP,
    nome character varying(250) NOT NULL,
    relevancia integer
);


-- ALTER TABLE public."TipoCrime" OWNER TO "username";

--
-- Name: TipoCrime_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public."TipoCrime_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public."TipoCrime_id_seq" OWNER TO "username";

--
-- Name: TipoCrime_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public."TipoCrime_id_seq" OWNED BY public."TipoCrime".id;


--
-- Name: Visita; Type: TABLE; Schema: public;
--

CREATE TABLE public."Visita" (
    id bigint NOT NULL,
    data_ins timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    data_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    id_alt_penal bigint NOT NULL,
    info_geo jsonb,
    data_visita character varying(250),
    alteracao_boletim integer,
    observacao character varying(250),
    voucher integer
);


-- ALTER TABLE public."Visita" OWNER TO "username";

--
-- Name: Visita_id_seq; Type: SEQUENCE; Schema: public
--

CREATE SEQUENCE public."Visita_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


-- ALTER TABLE public."Visita_id_seq" OWNER TO "username";

--
-- Name: Visita_id_seq; Type: SEQUENCE OWNED BY; Schema: public
--

ALTER SEQUENCE public."Visita_id_seq" OWNED BY public."Visita".id;


--
-- Name: Crime id; Type: DEFAULT; Schema: public
--

ALTER TABLE ONLY public."Crime" ALTER COLUMN id SET DEFAULT nextval('public."Crime_id_seq"'::regclass);


--
-- Name: IndexEndereco id; Type: DEFAULT; Schema: public
--

ALTER TABLE ONLY public."IndexEndereco" ALTER COLUMN id SET DEFAULT nextval('public."IndexEndereco_id_seq"'::regclass);


--
-- Name: AltPenal id; Type: DEFAULT; Schema: public
--

ALTER TABLE ONLY public."AltPenal" ALTER COLUMN id SET DEFAULT nextval('public."AltPenal_id_seq"'::regclass);


--
-- Name: Pessoa id; Type: DEFAULT; Schema: public
--

ALTER TABLE ONLY public."Pessoa" ALTER COLUMN id SET DEFAULT nextval('public."Pessoa_id_seq"'::regclass);


--
-- Name: TipoCrime id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public."TipoCrime" ALTER COLUMN id SET DEFAULT nextval('public."TipoCrime_id_seq"'::regclass);


--
-- Name: Visita id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public."Visita" ALTER COLUMN id SET DEFAULT nextval('public."Visita_id_seq"'::regclass);

--
-- Name: Crime Crime_pkey; Type: CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public."Crime"
    ADD CONSTRAINT "Crime_pkey" PRIMARY KEY (id);

--
-- Name: Endereco Endereco_pkey; Type: CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public."Endereco"
    ADD CONSTRAINT "Endereco_pkey" PRIMARY KEY (id, id_pessoa);


--
-- Name: IndexEndereco IndexEndereco_pkey; Type: CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public."IndexEndereco"
    ADD CONSTRAINT "IndexEndereco_pkey" PRIMARY KEY (id);


--
-- Name: AltPenal AltPenal_pkey; Type: CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public."AltPenal"
    ADD CONSTRAINT "AltPenal_pkey" PRIMARY KEY (id);


--
-- Name: Pessoa Pessoa_pkey; Type: CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public."Pessoa"
    ADD CONSTRAINT "Pessoa_pkey" PRIMARY KEY (id);


--
-- Name: TipoCrime TipoCrime_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public."TipoCrime"
    ADD CONSTRAINT "TipoCrime_pkey" PRIMARY KEY (id);


--
-- Name: Visita Visita_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public."Visita"
    ADD CONSTRAINT "Visita_pkey" PRIMARY KEY (id);

--
-- Name: Pessoa cpf_ukey; Type: CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public."Pessoa"
    ADD CONSTRAINT "cpf_ukey" UNIQUE (cpf);


--
-- Name: Crime altera_crime_data_at; Type: TRIGGER; Schema: public
--

CREATE TRIGGER altera_crime_data_at BEFORE UPDATE ON public."Crime" FOR EACH ROW EXECUTE FUNCTION public.altera_data_at();


--
-- Name: Endereco altera_endereco_data_at; Type: TRIGGER; Schema: public
--

CREATE TRIGGER altera_endereco_data_at BEFORE UPDATE ON public."Endereco" FOR EACH ROW EXECUTE FUNCTION public.altera_data_at();


--
-- Name: IndexEndereco altera_index_endereco_data_at; Type: TRIGGER; Schema: public
--

CREATE TRIGGER altera_index_endereco_data_at BEFORE UPDATE ON public."IndexEndereco" FOR EACH ROW EXECUTE FUNCTION public.altera_data_at();


--
-- Name: AltPenal altera_alt_penal_data_at; Type: TRIGGER; Schema: public
--

CREATE TRIGGER altera_alt_penal_data_at BEFORE UPDATE ON public."AltPenal" FOR EACH ROW EXECUTE FUNCTION public.altera_data_at();


--
-- Name: Pessoa altera_pessoa_data_at; Type: TRIGGER; Schema: public
--

CREATE TRIGGER altera_pessoa_data_at BEFORE UPDATE ON public."Pessoa" FOR EACH ROW EXECUTE FUNCTION public.altera_data_at();


--
-- Name: Visita altera_pessoa_data_at; Type: TRIGGER; Schema: public
--

CREATE TRIGGER altera_pessoa_data_at BEFORE UPDATE ON public."Visita" FOR EACH ROW EXECUTE FUNCTION public.altera_data_at();


--
-- Name: TipoCrime altera_tipo_crime_data_at; Type: TRIGGER; Schema: public;
--

CREATE TRIGGER altera_tipo_crime_data_at BEFORE UPDATE ON public."TipoCrime" FOR EACH ROW EXECUTE FUNCTION public.altera_data_at();


--
-- Name: Endereco seq_chave_composta_end; Type: TRIGGER; Schema: public;
--

CREATE TRIGGER seq_chave_composta_end BEFORE INSERT ON public."Endereco" FOR EACH ROW EXECUTE FUNCTION public.seq_chave_composta_end();


--
-- Name: AltPenal id_endereco_fk; Type: FK CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public."AltPenal"
    ADD CONSTRAINT id_endereco_fk FOREIGN KEY (id_endereco, id_pessoa) REFERENCES public."Endereco"(id, id_pessoa) NOT VALID;


--
-- Name: Crime id_alt_penal_fk; Type: FK CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public."Crime"
    ADD CONSTRAINT id_alt_penal_fk FOREIGN KEY (id_alt_penal) REFERENCES public."AltPenal"(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT VALID;


--
-- Name: Visita id_alt_penal_fk; Type: FK CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public."Visita"
    ADD CONSTRAINT id_alt_penal_fk FOREIGN KEY (id_alt_penal) REFERENCES public."AltPenal"(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT VALID;


--
-- Name: IndexEndereco id_pessoa_fk; Type: FK CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public."IndexEndereco"
    ADD CONSTRAINT id_pessoa_fk FOREIGN KEY (id_pessoa) REFERENCES public."Pessoa"(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT VALID;


--
-- Name: Endereco id_pessoa_fk; Type: FK CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public."Endereco"
    ADD CONSTRAINT id_pessoa_fk FOREIGN KEY (id_pessoa) REFERENCES public."Pessoa"(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT VALID;


--
-- Name: AltPenal id_pessoa_fk; Type: FK CONSTRAINT; Schema: public
--

ALTER TABLE ONLY public."AltPenal"
    ADD CONSTRAINT id_pessoa_fk FOREIGN KEY (id_pessoa) REFERENCES public."Pessoa"(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT VALID;

--
-- Name: Crime id_tipo_crime_fk; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public."Crime"
    ADD CONSTRAINT id_tipo_crime_fk FOREIGN KEY (id_tipo_crime) REFERENCES public."TipoCrime"(id) ON UPDATE RESTRICT ON DELETE RESTRICT NOT VALID;


--
-- PostgreSQL database dump complete
--

