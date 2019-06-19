import { fhirReferenceRegEx } from './fhir-regular-expressions';
import queryString from 'query-string';

/**
 * Split a FHIR reference into its baseUrl (if present), type, and id
 *
 * @example
 *
 * // With an absolute reference
 * { baseUrl, resourceType, id } = splitReference('http://www.example.com/fhir/Patient/1');
 * console.log(`${baseUrl}/${resourceType}/${id}`);
 *
 * // With a relative reference
 * { resourceType, id } = splitReference('Patient/1');
 * console.log('${resourceType}/${id}');
 *
 * @param {String} reference the FHIR reference
 *
 * @return {Object} Contains baseUrl, resourceType, and id fields. baseUrl will be
 * undefined for relative references
 */
export const splitReference = function(reference) {
  if (!reference.match(fhirReferenceRegEx)) {
    throw new Error(`${reference} is not a recognized FHIR reference`);
  }
  let baseUrl;
  let relativeReference = reference;
  if (reference.startsWith('http')) {
    [, baseUrl] = fhirReferenceRegEx.exec(reference);
    relativeReference = reference.slice(baseUrl.length);
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }
  }
  const [resourceType, id] = relativeReference.split('/');
  return {
    baseUrl,
    resourceType,
    id,
  };
};

export const createQueryString = function(queryParams) {
  if (queryParams instanceof Object && Object.keys(queryParams).length > 0) {
    return queryString.stringify(queryParams);
  }
};
