import { createDefaultModule, DefaultModuleContext, inject, LangiumServices, Module, PartialLangiumServices } from 'langium';
import { UxifierGeneratedModule } from './generated/module';
import { UxifierValidationRegistry, UxifierValidator } from './uxifier-validator';

/**
 * Declaration of custom services - add your own service classes here.
 */
export type UxifierAddedServices = {
    validation: {
        UxifierValidator: UxifierValidator
    }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type UxifierServices = LangiumServices & UxifierAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const UxifierModule: Module<UxifierServices, PartialLangiumServices & UxifierAddedServices> = {
    validation: {
        ValidationRegistry: (injector) => new UxifierValidationRegistry(injector),
        UxifierValidator: () => new UxifierValidator()
    }
};

/**
 * Inject the full set of language services by merging three modules:
 *  - Langium default services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 */
export function createUxifierServices(context?: DefaultModuleContext): UxifierServices {
    return inject(
        createDefaultModule(context),
        UxifierGeneratedModule,
        UxifierModule
    );
}