import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../../services/producto';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-producto-form',
  standalone: false,
  templateUrl: './producto-form.html',
  styleUrl: './producto-form.css'
})
export class ProductoForm implements OnInit {

  productoForm!: FormGroup;
  enviado = false;
  mensajeExito = '';

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.productoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      precio: [null, [Validators.required, Validators.min(0.01)]],
      categoria: ['', Validators.required],
      stock: [null, [Validators.required, Validators.min(0)]]
    });
  }

  // getter de acceso rápido a los controles, se usa mucho en el HTML
  get f() {
    return this.productoForm.controls;
  }

  onSubmit(): void {
    this.enviado = true;

    if (this.productoForm.invalid) {
      // marca todos los campos como "touched" para que se muestren
      // los errores aunque el usuario no haya hecho clic en cada uno
      this.productoForm.markAllAsTouched();
      return;
    }

    const producto: Producto = this.productoForm.value;

    this.productoService.registrarProducto(producto).subscribe({
      next: (respuesta) => {
        console.log('Producto enviado correctamente:', respuesta);
        this.mensajeExito = 'Producto registrado con éxito.';
        this.productoForm.reset();
        this.enviado = false;
      },
      error: (err) => {
        console.error('Error al enviar el producto:', err);
      }
    });
  }
}