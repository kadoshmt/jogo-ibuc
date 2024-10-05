"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { useState } from "react";
import CheckboxGroup from "./CheckboxGroup";
import Checkbox from "./Checkbox";
import Switcher from "./Switcher";
import RadioGroup from "./RadioGroup";
import { UserIcon, UsersIcon } from "@heroicons/react/24/outline";
import InputGroup from "./InputGroup";
import TextArea from "./TextArea";
import DatePicker from "./DatePicker";
import DateTimePicker from "./DateTimePicker";
import TimePicker from "./TimePicker";
import InputFile from "./InputFile";
import SelectGroup from "./SelectGroup";
import MultiSelect from "./MultiSelect";
import { Controller, useForm } from "react-hook-form";
import PasswordInputGroup from "./PasswordInput";
import { KeyIcon } from "@heroicons/react/24/outline";

const FormElements = () => {
  const [selectedFruits, setSelectedFruits] = useState<string[]>([]);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [selectedFruitIds, setSelectedFruitIds] = useState<number[]>([]);
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('Verde');
  const [selectedGenre, setSelectedGenre] = useState<string>('MASCULINO');
  const [selectedVehicleId, setSelectedVehicleId] = useState<number>(2);
  const [selectedVegetables, setSelectedVegetables] = useState<string[]>([]);
  const [selectedCityIds, setSelectedCityIds] = useState<number[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const fruits = ['Maçã', 'Banana', 'Uva'];
  const vegetables = ['Cenoura', 'Beringela', 'Batata', 'Cebola', 'Pimentão'];

  const colors = ['Vermelho', 'Verde', 'Azul'];

  interface Fruit {
    id: number;
    name: string;
  }

  const fruitOptions: Fruit[] = [
    { id: 1, name: 'Maçã' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Uva' },
  ];

  interface VehicleType {
    id: number;
    label: string;
  }

  const options: VehicleType[] = [
    { id: 1, label: 'Aéreo' },
    { id: 2, label: 'Terrestre' },
    { id: 3, label: 'Marítimo' },
  ];

  interface Genre {
    value: string;
    name: string;
  }

  const genreOptions: Genre[] = [
    { value: "MASCULINO", name: "Masculino" },
    { value: "FEMININO", name: "Feminino" },
    { value: "NAO_INFORMADO", name: "Não Informado" },
  ];

  interface City {
    id: number;
    name: string;
  }

  const cities: City[] = [
    { id: 1, name: 'São Paulo' },
    { id: 2, name: 'Rio de Janeiro' },
    { id: 3, name: 'Belo Horizonte' },
    { id: 4, name: 'Curitiba' },
    { id: 5, name: 'Porto Alegre' },
    { id: 6, name: 'Aracajú' },
    { id: 7, name: 'Cuiabá' },
    { id: 8, name: 'Florianópolis' },
    { id: 9, name: 'Fortaleza' },
    { id: 10, name: 'Manaus' },
  ];

  interface Interests {
    value: string;
    name: string;
  }

  const interests: Interests[] = [
    { value: 'technology', name: 'Tecnologia' },
    { value: 'sports', name: 'Esportes' },
    { value: 'music', name: 'Música' },
  ];

  interface Subscription {
    value: string;
    name: string;
  }

  const subscription: Subscription[] =[
    { value: 'free', name: 'Gratuito' },
    { value: 'premium', name: 'Premium' },
    { value: 'enterprise', name: 'Enterprise' },
  ];

  const {
    control,
    formState: { errors },

  } = useForm<any>({
    defaultValues: {
      interests: ['technology'],
      subscription: ['premium'],
    },
  });



  return (
    <>
      <Breadcrumb pageName="FormElements" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
          {/* <!-- Input Fields --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Input Fields
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
                <InputGroup
                    label="Default Input "
                    type="text"
                    name="default"
                    id="default"
                    placeholder="Informe o valor"
                    customClasses="w-full"
                  />

                <InputGroup
                    label="Default Input com ícone "
                    type="text"
                    name="defaultIcon"
                    id="defaultIcon"
                    placeholder="Informe o valor"
                    customClasses="w-full"
                    icon={<UserIcon className="size-5" />}
                  />

                <InputGroup
                    label="Password Input "
                    type="password"
                    name="passwordField"
                    id="passwordField"
                    customClasses="w-full"
                  />


                <InputGroup
                    label="Desabled Input com ícone "
                    type="text"
                    name="desabledIcon"
                    id="desabledIcon"
                    placeholder="Informe o valor"
                    customClasses="w-full"
                    icon={<UserIcon className="size-5" />}
                    disabled
                  />

                <PasswordInputGroup
                    label="Input de senha"
                    name="desabledIcon"
                    id="desabledIcon"
                    placeholder="Informe sua senha"
                    customClasses="w-full"
                    icon={<KeyIcon className="size-5" />}
                  />
            </div>
          </div>

          {/* <!-- Toggle switch input --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Toggle switch input
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
            <Switcher
                label="Ativar opção"
                checked={isEnabled}
                onChange={(checked) => setIsEnabled(checked)}
              />
            </div>
          </div>

          {/* <!-- Time and date --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Time and date
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">

            <TimePicker
                label="Default TimePicker"
                placeholder="00:00"
                name="time"
                id="time"
                required
              />

              <DatePicker
                label="Default DatePicker"
                placeholder="Selecione a data"
                name="data1"
                id="data1"
                required
              />

            <DateTimePicker
                label="Default DateTimePicker"
                placeholder="Seleciona a data e hora"
                name="data2"
                id="data2"
                altInput={false}
                dateFormat="Y-m-d H:i"
              />
            </div>
          </div>

          {/* <!-- File upload --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                File upload
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">

              <InputFile
                name="file1"
                id="file1"
                label="Arquivo"
              />


            </div>
          </div>
          {/* <!-- Select input --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Select input
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              {/* <MultiSelect id="multiSelect" /> */}
              <SelectGroup
                label="Sexo"
                options={genreOptions}
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                required
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.value}
                icon={<UsersIcon className="size-5" />}
              />
              <p>Sexo selecionado: {selectedGenre}</p>

              <MultiSelect<string, string>
                options={vegetables}
                value={selectedVegetables}
                onChange={setSelectedVegetables}
                label="Selecione as verduras"
                placeholder="Escolha suas verduras favoritas"
              />

              <p>Verduras selecionadas: {selectedVegetables}</p>

              <MultiSelect<City, number>
                    options={cities}
                    value={selectedCityIds}
                    onChange={setSelectedCityIds}
                    getOptionLabel={(option) => option.name}
                    getOptionValue={(option) => option.id}
                    label="Selecione as cidades"
                    placeholder="Escolha suas cidades favoritas"
                  />

              <p>IDs das cidades selecionadas: {selectedCityIds}</p>


            </div>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          {/* <!-- Textarea Fields --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Textarea Fields
              </h3>
            </div>
            <div className="flex flex-col gap-6 p-6.5">
              <TextArea
                label="Default TextArea"
                required
                rows={6}
                placeholder="Default Text Area"
              />

              <TextArea
                label="Disabled TextArea"
                rows={6}
                placeholder="Disabled Text Area"
                disabled
              />

            </div>
          </div>

          {/* <!-- Checkbox and radio --> */}
          <div className="rounded-[10px] border border-stroke bg-white shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
              <h3 className="font-medium text-dark dark:text-white">
                Checkbox and radio
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <CheckboxGroup<string, string>
                options={fruits}
                value={selectedFruits}
                onChange={setSelectedFruits}
                label="Selecione as frutas"
                required
              />
              <p>Frutas selecionadas: {selectedFruits}</p>

            <CheckboxGroup<Fruit, number>
              options={fruitOptions}
              value={selectedFruitIds}
              onChange={setSelectedFruitIds}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option.id}
              label="Selecione as frutas"
              required
              layout="block"
            />
            <p>Ids das frutas selecionadas: {selectedFruitIds}</p>



            {/* Exemplo de CheckboxGroup com React Hook Form */}
            <Controller
              name="interests"
              control={control}
              render={({ field }) => (
                <CheckboxGroup<Interests, string>
                  options={interests}
                  value={selectedInterests}
                  onChange={field.onChange}
                  getOptionLabel={(option) => option.name}
                  getOptionValue={(option) => option.value}
                  label="Interesses"
                  required
                  customClasses="w-full sm:w-1/2"
                  error={"teste de mensagem de erro"}
                />
              )}
            />

            <p>Interesses selecionados: {selectedInterests}</p>

            <Checkbox
              label="Aceito os termos e condições"
              checked={isAgreed}
              onChange={(checked) => setIsAgreed(checked)}
            />
            <p>{isAgreed ? "Você aceitou os termos." : "Você não aceitou os termos."}</p>

            <RadioGroup<string, string>
              options={colors}
              value={selectedColor}
              onChange={setSelectedColor}
              name="colors"
              label="Selecione uma cor"
              required
            />

            <p>Cor selecionada: {selectedColor}</p>

            <RadioGroup<VehicleType, number>
                  options={options}
                  value={selectedVehicleId}
                  onChange={setSelectedVehicleId}
                  name="options"
                  getOptionLabel={(option) => option.label}
                  getOptionValue={(option) => option.id}
                  label="Selecione uma opção"
                  required
                  layout="block"
                />

            <p>Id do tipo de Veículo selecionado: {selectedVehicleId}</p>

            {/* Exemplo de RadioGroup com React Hook Form */}
            <Controller
              name="subscriptionController"
              control={control}
              render={({ field }) => (
                <RadioGroup<Subscription, number>
                  options={subscription}
                  value={field.value}
                  onChange={field.onChange}
                  name="subscription"
                  label="Selecione uma opção"
                  required
                  customClasses="w-full sm:w-1/2"
                  error={"teste"}
                />
              )}
            />
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default FormElements;
